# -*- coding: utf-8 -*-
G = {'AA':4.0,'BA':3.5,'BB':3.0,'CB':2.5,'CC':2.0,'DC':1.5,'DD':1.0,'FD':0.5,'FF':0.0,'F0':0.0}
# (kod, tur, kredi, ects, not)
sems = [
("2023-2024 Guz", 1.84, [
 ("ATA1031","Z",0,2,"BA"),("END1911","Z",2,2,"BB"),("END1991","Z",3,5,"CC"),
 ("END1151","Z",3,4,"FF"),("FIZ1001","Z",4,6,"DD"),("MAT1071","Z",4,6,"CB"),
 ("MDB1031","Z",3,3,"BB"),("TDB1031","Z",0,2,"AA"),("TIB1000","Z",0,0,"CB")]),
("2023-2024 Bahar", 2.08, [
 ("END1902","Z",3,4,"FF"),("END1912","Z",2,2,"CB"),("FIZ1002","Z",4,6,"DD"),
 ("KIM1170","Z",4,6,"BA"),("MAT1072","Z",4,6,"CC"),("MDB1032","Z",3,3,"BA"),
 ("TDB1032","Z",0,2,"BB")]),
("2023-2024 Yaz", 0.00, [("FIZ1001","Z",4,6,"F0"),("FIZ1002","Z",4,6,"FF")]),
("2024-2025 Guz", 0.74, [
 ("END1151","Z",3,4,"FF"),("END2961","Z",3,4,"CB"),("END2991","Z",3,6,"FF"),
 ("END3401","Z",3,5,"FF"),("FIZ1001","Z",4,6,"FF"),("MAT1320","Z",2,4,"CB"),
 ("MAT2411","Z",4,6,"DC"),("MDB1010","S",3,3,"F0")]),
("2024-2025 Bahar", 1.64, [
 ("END1902","Z",3,4,"CC"),("END2312","Z",3,4,"BB"),("END2962","Z",3,6,"BB"),
 ("END2972","Z",4,6,"F0"),("END2982","Z",3,4,"CC"),("END3940","S",2,4,"DD"),
 ("END3982","Z",3,5,"BB"),("FIZ1002","Z",4,6,"FF")]),
("2024-2025 Yaz", 4.00, [("MAT1071","Z",4,6,"AA"),("MAT2411","Z",4,6,"AA")]),
("2025-2026 Guz", 2.00, [
 ("END1151","Z",3,4,"FF"),("END1991","Z",3,5,"BB"),("END2961","Z",3,4,"CC"),
 ("END2991","Z",3,6,"BA"),("END3401","Z",3,5,"AA"),("FIZ1001","Z",4,6,"CC"),
 ("ITB3010","S",3,3,"DC"),("ITB3270","S",3,3,"F0")]),
("2025-2026 Bahar", 2.00, [
 ("END2972","Z",4,6,"FF"),("END2992","Z",3,6,"BB"),("END3192","Z",0,1,"AA"),
 ("END3880","S",2,4,"CC"),("END3962","Z",3,5,"BA"),("END3965","S",3,5,"CC"),
 ("END3972","S",2,4,"CB"),("FIZ1002","Z",4,6,"CC"),("ITB3130","S",3,3,"CB"),
 ("MFK4991","Z",1,3,"FF")]),
]

print("--- YANO (yerel kredi, F0=0 dahil) ---")
for name, ref, cs in sems:
    p = sum(G[g]*c for _,_,c,_,g in cs if c>0)
    k = sum(c for _,_,c,_,g in cs if c>0)
    print(f"{name:20s} hesap={p/k if k else 0:.2f}  transkript={ref:.2f}  {'OK' if k and abs(p/k-ref)<0.006 else 'FARK'}")

last = {}
for i,(name,_,cs) in enumerate(sems):
    for kod,tur,c,e,g in cs:
        last[kod] = (tur,c,e,g)

def agno(pred):
    p = sum(G[g]*c for tur,c,e,g in last.values() if c>0 and pred(tur,g))
    k = sum(c for tur,c,e,g in last.values() if c>0 and pred(tur,g))
    return p, k, (p/k if k else 0)

print("\n--- AGNO varyantlari (transkript: AGNO=2.51, toplam kredi=92) ---")
for etiket, pred in [
    ("F0 dahil (yonetmelik)", lambda t,g: True),
    ("F0 haric (transkript legend)", lambda t,g: g!='F0'),
    ("Basarisiz secmeli haric", lambda t,g: not (t=='S' and G[g]<1.5)),
]:
    p,k,v = agno(pred)
    print(f"{etiket:32s} puan={p:7.1f} kredi={k:3d} AGNO={v:.4f} -> {round(v,2):.2f}")

tam = sum(c for tur,c,e,g in last.values() if G[g]>=1.5)
print(f"\nTamamlanan yerel kredi (DC ve ustu): {tam}  (transkript: 82)")
