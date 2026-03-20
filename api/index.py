#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PDF'den çıkarılan metni işleyip JSON'a çeviren web server
pdf_upload.html'den gelen text'i alır, parse eder ve JSON döndürür
REVİZE EDİLMİŞ VERSİYON: Dinamik Sıralama ve Yıl Kısıtlamasının Kaldırılması
"""

import json
import re
import traceback
from collections import OrderedDict
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import io

app = Flask(__name__)
CORS(app)


class TranscriptParser:
    """
    Boğaziçi Üniversitesi Not Döküm Belgesi (Transkript) metnini analiz eder.
    DC (Not) ve DÇ (Withdraw) ayrımını hassas şekilde yapar.
    """

    def __init__(self, transcript_text):
        self.transcript_text = transcript_text
        self.semesters = OrderedDict()
        self.cards = []
        self.card_id_counter = 1
        self.substitutions = self._extract_substitutions()

    def _extract_substitutions(self):
        """
        Transkriptin sonundaki 'Yerine Ders' (YRN) bilgisini çıkarır.
        """
        substitute_pattern = re.compile(
            r'(\b[A-Z]{2,}\s?\d{3}[A-Z]?) kodlu dersi (\b[A-Z]{2,}\s?\d{3}[A-Z]?) yerine almıştır\.'
        )
        substitutions = {}
        for match in substitute_pattern.finditer(self.transcript_text):
            new_course, old_course = match.groups()
            substitutions[new_course] = old_course
        return substitutions

    def _add_card(self, lesson_code, grade_raw, credit, comment_raw, semester_name, t_value):
        """
        Ders kartını oluşturur. DC notu ile DÇ statüsünü birbirinden ayırır.
        """
        if not lesson_code or not grade_raw or not credit:
            return
        
        # Boşlukları temizle
        grade = grade_raw.replace(" ", "").strip() if grade_raw else ""
        comment = comment_raw.replace(" ", "").strip() if comment_raw else ""
        
        # Hazırlık derslerini atla
        if lesson_code in ["SFL 11A", "SFL 11B", "SFL 12A", "SFL 12B"]:
            return

        # F ve KL notlarını FF olarak standartlaştır
        if grade == 'F' or grade == 'KL':
            grade = 'FF'

        # --- KRİTİK AYRIM MANTIĞI ---
        is_grade_w = (grade == 'W')
        is_comment_dc_tr = ('DÇ' in comment) # Sadece Türkçe karakterli DÇ
        
        is_withdrawn = is_grade_w or is_comment_dc_tr
        
        # Diğer Bayraklar
        is_repeated = "TKR" in comment
        is_substitute = "YRN" in comment
        
        repeated_lesson_code = ""
        status = "taken"
        lesson_input_type = "input"

        # --- DURUM BELİRLEME ---

        # Durum 1: Withdraw (Öncelikli)
        if is_withdrawn:
            status = "not taken"
            grade = "W"  # Not ne görünürse görünsün standart W yap
            lesson_input_type = "input"

        # Durum 2: Non-Credit (T değeri 0 ve Withdraw değilse)
        elif t_value == '0':
            status = "non credit"
            lesson_input_type = "input"
            # Geçilen NC derslerde notu temizle, kalanlarda FF kalsın
            if grade != 'FF':
                grade = ""

        # Durum 3: Tekrar veya Yerine Saydırma
        else:
            if is_substitute and lesson_code in self.substitutions:
                repeated_lesson_code = self.substitutions[lesson_code]
                status = "repeated with"
                lesson_input_type = "select"
            
            elif is_repeated:
                repeated_lesson_code = lesson_code 
                status = "repeated with"
                lesson_input_type = "select"
            
            # Bunlar değilse varsayılan: status = "taken"

        card_id = f"card-{self.card_id_counter}"
        
        card = {
            "id": card_id,
            "lesson": lesson_code,
            "lessonInputType": lesson_input_type, 
            "status": status,
            "grade": grade,
            "credit": credit,
            "repeatedLesson": repeated_lesson_code,
            "top": "",
            "left": "",
            "origin": ""
        }

        self.cards.append(card)
        if semester_name not in self.semesters:
            self.semesters[semester_name] = []
        self.semesters[semester_name].append(card_id)
        self.card_id_counter += 1

    def parse(self):
        """
        Regex ile metni tarar. 'Whitelist' mantığı kaldırılmıştır, regex'e uyan her dönemi alır.
        """
        
        # Dönem Bloklarını Yakala
        semester_blocks = re.findall(
            r'(\d{4}-\d{4}\s+(?:Güz|Bahar|Yaz Okulu|Fall Term|Spring Term|Summer School))'
            r'(.*?)(?=\d{4}-\d{4}\s+(?:Güz|Bahar|Yaz Okulu|Fall Term|Spring Term|Summer School)|Açıklamalar|\Z)',
            self.transcript_text, re.DOTALL
        )
        
        # Ders Satırlarını Yakala
        lesson_pattern = re.compile(
            r'(\b[A-Z]{2,}\s?\d{3}[A-Z]?)'  # Grup 1: Ders Kodu
            r'\s+.*?'                       # Ders Adı (Atla)
            r'(Z|S)'                        # Grup 2: Statü
            r'\s+İng\.?\s+'                 # Dil
            r'(\d+)'                        # Grup 3: T (Teorik Saat)
            r'\s+\d+\s+'                    # U (Uygulama)
            r'(\d+)'                        # Grup 4: UK (Kredi)
            r'\s+\d+\s+'                    # AKTS
            r'[\d\.]+\s+'                   # Puan
            r'([A-Z]{1,2}|F|KL)'            # Grup 5: NOT (Grade)
            r'\s+([A-ZÇĞİÖŞÜ]{1,3}|\-|--)+' # Grup 6: AÇIKLAMA (Comment)
        )
        
        processed_english_names = set()
        
        for name_block, content in semester_blocks:
            # Dönem adı temizleme ve standardize etme
            english_name_match = re.search(r'\(([^)]+)\)', name_block)
            if english_name_match:
                english_name = english_name_match.group(1).strip()
            else:
                english_name = name_block.split('\n')[0].split('(')[-1].strip().replace('Term)', 'Term').replace('School)', 'School')
            
            # Türkçe -> İngilizce standartlaştırma (Eğer Türkçe geldiyse)
            if 'Dönemi' in english_name or 'Okulu' in english_name:
                # Yılı yakala (Örn: 2023-2024)
                year_match = re.search(r'(\d{4}-\d{4})', name_block)
                if year_match:
                    year_str = year_match.group(1)
                    if 'Güz' in name_block: 
                        english_name = f"{year_str} Fall Term"
                    elif 'Bahar' in name_block: 
                        english_name = f"{year_str} Spring Term"
                    elif 'Yaz' in name_block: 
                        english_name = f"{year_str} Summer School"
            
            # Whitelist kontrolü KALDIRILDI. Artık Regex'e takılan her dönem işleniyor.
            processed_english_names.add(english_name)
            
            for lesson_match in lesson_pattern.finditer(content):
                try:
                    groups = lesson_match.groups()
                    if len(groups) < 6:
                        continue
                    
                    lesson_code, status_col, t_value, credit, grade_raw, comment_raw = groups
                    
                    if not lesson_code or not credit or not grade_raw:
                        continue
                        
                    self._add_card(lesson_code, grade_raw, credit, comment_raw or '', english_name, t_value)
                except Exception as e:
                    print(f"Hata: {e}")
                    continue

        # JSON Çıktısı oluşturma
        final_semesters = []
        
        # self.semesters OrderedDict olduğu için ekleme sırasını korur, ancak biz aşağıda tekrar sort edeceğiz.
        for name, card_ids in self.semesters.items():
             final_semesters.append({
                "name": name,
                "cards": card_ids # Kart ID'leri zaten eklenme sırasına göre sıralı
            })

        unique_cards = {}
        for card in self.cards:
            unique_cards[card['id']] = card
            
        return {
            "semesters": final_semesters,
            "cards": list(unique_cards.values())
        }


def apply_custom_semester_names(result_json):
    """
    Semester isimlerini Türkçeleştirir ve Dinamik olarak (Yıl + Dönem) sıralar.
    Manual sıralama listesi kaldırılmıştır.
    """
    custom_semester_names = {
        "2019-2020 Fall Term": "2019-2020 Güz Dönemi",
        "2019-2020 Spring Term": "2019-2020 Bahar Dönemi",
        "2019-2020 Summer School": "2019-2020 Yaz Okulu",
        
        "2020-2021 Fall Term": "2020-2021 Güz Dönemi",
        "2020-2021 Spring Term": "2020-2021 Bahar Dönemi",
        "2020-2021 Summer School": "2020-2021 Yaz Okulu",

        "2021-2022 Fall Term": "2021-2022 Güz Dönemi",
        "2021-2022 Spring Term": "2021-2022 Bahar Dönemi",
        "2021-2022 Summer School": "2021-2022 Yaz Okulu",
        
        "2022-2023 Fall Term": "2022-2023 Güz Dönemi",
        "2022-2023 Spring Term": "2022-2023 Bahar Dönemi",
        "2022-2023 Summer School": "2022-2023 Yaz Okulu",

        "2023-2024 Fall Term": "2023-2024 Fall Term",
        "2023-2024 Spring Term": "2023-2024 Spring Term",
        "2023-2024 Summer School": "2023-2024 Yaz Okulu",

        "2024-2025 Fall Term": "2024-2025 Fall Term",
        "2024-2025 Spring Term": "2024-2025 Spring Term",
        "2024-2025 Summer School": "2024-2025 Yaz Okulu",
        
        # Gelecek dönemler için de şablon ekleyebilirsin, 
        # ama eklemesen bile kod artık hata vermez, orijinal İngilizce halini kullanır.
    }

    final_semesters_list = []

    for item in result_json['semesters']:
        # Sözlükte varsa Türkçesini al, yoksa orijinalini kullan
        name_to_use = custom_semester_names.get(item['name'], item['name'])
        
        # Summer School dublikasyonu için özel kontrol (İsteğin üzerine korundu)
        if item['name'] == '2022-2023 Summer School':
             final_semesters_list.append({
                "name": '2022-2023 Yaz Okulu',
                "cards": item['cards']
            })
             final_semesters_list.append({
                "name": '2022-2023 Summer School',
                "cards": item['cards']
            })
        else:
            final_semesters_list.append({
                "name": name_to_use,
                "cards": item['cards']
            })

    # --- DİNAMİK SIRALAMA MANTIĞI ---
    def semester_sort_key(semester_obj):
        name = semester_obj['name']
        
        # Yılı ayıkla (Örn: "2023-2024" -> 2023)
        # Regex hem '2023-2024' formatını hem de metin içindeki ilk 4 haneli yılı yakalar.
        year_match = re.search(r'(\d{4})', name)
        year = int(year_match.group(1)) if year_match else 0
        
        # Dönem sıralaması: Güz(1) -> Bahar(2) -> Yaz(3)
        term_rank = 4 # Bilinmeyenler en sona
        
        if 'Güz' in name or 'Fall' in name:
            term_rank = 1
        elif 'Bahar' in name or 'Spring' in name:
            term_rank = 2
        elif 'Yaz' in name or 'Summer' in name:
            term_rank = 3
            
        # Tuple döndür: Önce yıla göre, yıl aynıysa döneme göre sırala
        return (year, term_rank)

    # Listeyi sırala
    final_semesters_list.sort(key=semester_sort_key)
                
    final_output = {
        "semesters": final_semesters_list,
        "cards": result_json['cards']
    }
    return final_output


@app.route('/api/process', methods=['POST'])
def process_text():
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({'error': 'Text bulunamadı'}), 400
        
        text = data['text']
        
        parser = TranscriptParser(text)
        result_json = parser.parse()
        
        if not result_json['semesters'] or not result_json['cards']:
            return jsonify({'error': 'Hiçbir dönem veya ders bulunamadı'}), 400
        
        final_json = apply_custom_semester_names(result_json)
        
        json_str = json.dumps(final_json, ensure_ascii=False, indent=2)
        json_bytes = json_str.encode('utf-8')
        return send_file(
            io.BytesIO(json_bytes),
            mimetype='application/json',
            as_attachment=True,
            download_name='lessons_and_grids.json'
        )
        
    except Exception as e:
        error_trace = traceback.format_exc()
        return jsonify({
            'error': str(e),
            'traceback': error_trace
        }), 500


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})


if __name__ == '__main__':
    app.run(host='localhost', port=5001, debug=True)