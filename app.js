// Helper to get element's center
    function getCenter(el) {
        const rect = el.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2 + window.scrollX,
          y: rect.top + rect.height / 2 + window.scrollY
        };
      }
  
      // Letter grade to numeric value mapping
      const gradeMap = {
        'AA': 4.0, 'BA': 3.5, 'BB': 3.0, 'CB': 2.5,
        'CC': 2.0, 'DC': 1.5, 'DD': 1.0, 'FF': 0.0
      };

      // Global variable to track magnets
      let magnets = [];
      const cardToMagnet = new Map(); // card element -> magnet element
      const magnetToCard = new Map(); // magnet element -> card element
      const magnetRadius = 70; // px

      // --- YENİ YARDIMCI FONKSİYON: Running GPA (O ana kadarki GPA) ---
      // Bu fonksiyon, belirli bir döneme (currentSemesterIndex) kadar olan dersleri
      // dikkate alarak kümülatif GPA hesaplar.
      function calculateRunningGPA(allCards, currentSemesterIndex, gradeMap, cardToMagnet) {
        const courseAttempts = new Map(); // lessonName -> { card, semesterIndex }[]
        
        // 1. Kartları Tara: Sadece currentSemesterIndex'e eşit veya küçük olanları al
        allCards.forEach(card => {
            const magnet = cardToMagnet.get(card);
            if (!magnet) return; // Henüz bir magnete yapışmamışsa hesaba katma
            
            const [cardSemesterIdxStr] = magnet.dataset.magnet.split('-');
            const cardSemesterIdx = parseInt(cardSemesterIdxStr);
            
            // Gelecek dönemdeki dersi hesaba katma
            if (cardSemesterIdx > currentSemesterIndex) return; 
            
            // Ders adını al
            const status = card.querySelector('.status-select').value;
            let lessonName = '';
            if (status === 'repeated with') {
                lessonName = card.dataset.repeatedLesson || '';
            } else {
                const lessonInput = card.querySelector('.lesson-input') || card.querySelector('.lesson-select');
                lessonName = lessonInput ? lessonInput.value : '';
            }
            
            if (!lessonName || lessonName.trim() === '') return; // İsimsiz dersleri atla

            if (!courseAttempts.has(lessonName)) {
                courseAttempts.set(lessonName, []);
            }
            courseAttempts.get(lessonName).push({ card, semesterIndex: cardSemesterIdx });
        });

        let cumulativeTotal = 0;
        let cumulativeCredits = 0;
        let cumulativeAttempted = 0;
        let cumulativeCompleted = 0;
        
        // 2. Tekrar Kuralını Uygula: Her ders grubu için en son girişimi bul
        courseAttempts.forEach((attempts, lessonName) => {
            // En son alınan kartı bul (Dönem indexi en büyük olan)
            let latestAttempt = attempts.reduce((latest, current) => {
                if (current.semesterIndex > latest.semesterIndex) {
                    return current;
                }
                // Aynı dönemde ise (nadir durum), repeated with tercih edilebilir
                const currentStatus = current.card.querySelector('.status-select').value;
                if (current.semesterIndex === latest.semesterIndex && currentStatus === 'repeated with') {
                     return current;
                }
                return latest;
            }, { semesterIndex: -1, card: null });

            if (latestAttempt.card) {
                const card = latestAttempt.card;
                const status = card.querySelector('.status-select').value;
                let gradeValue = card.querySelector('.grade-input').value;
                let credit = parseFloat(card.querySelector('.credit-input').value);
                let gradeNumeric = gradeMap.hasOwnProperty(gradeValue) ? gradeMap[gradeValue] : parseFloat(gradeValue);

                if (isNaN(credit) || credit <= 0) return;
                
                // İstatistikleri topla
                if (status !== 'not taken' && status !== 'non credit') {
                                  cumulativeAttempted += credit;
                }
                
                if (status === 'taken' || status === 'repeated with') {
                    cumulativeTotal += gradeNumeric * credit;
                    cumulativeCredits += credit;
                    if (gradeNumeric > 0) {
                        cumulativeCompleted += credit;
                    }
                }
            }
        });

        const gpa = cumulativeCredits > 0 ? (cumulativeTotal / cumulativeCredits) : 0;
        
        return { 
            gpa, 
            total: cumulativeTotal, 
            credits: cumulativeCredits, 
            attempted: cumulativeAttempted,
            completed: cumulativeCompleted
        };
      }

      // --- ANA HESAPLAMA FONKSİYONU ---
      // Artık GPA ve SPA hesaplamaları tek bir çatı altında yönetiliyor.
      function calculateGridSPAs() {
        remapAllCardsToMagnets(); // Kartların yerlerini güncelle
        
        const gridCells = document.querySelectorAll('.grid-cell');
        const magnetsPerCell = 8;
        const allCards = Array.from(document.querySelectorAll('.card'));
        
        // 1. Kart Renklendirmeleri için Tekrar Kontrolü (Görsel Amaçlı)
        // Global olarak hangilerinin tekrarlandığını bilmemiz lazım ki turuncuya boyayalım
        const repeatedLessonsMap = new Map();
        allCards.forEach(card => {
             const status = card.querySelector('.status-select').value;
             if (status === 'repeated with') {
                  const lessonName = card.dataset.repeatedLesson;
                  if (lessonName) repeatedLessonsMap.set(lessonName, true);
             }
        });

        // 2. Her Dönem İçin Hesaplamalar
        gridCells.forEach((cell, cellIdx) => {
            let total = 0, totalCredits = 0;
            let semesterAttempted = 0;
            let semesterCompleted = 0;
            
            const semesterCards = [];

            // Bu döneme ait kartları topla
            for (let m = 0; m < magnetsPerCell; m++) {
                const magnet = document.querySelector(`.magnet[data-magnet='${cellIdx}-${m}']`);
                if (!magnet) continue;
                const card = magnetToCard.get(magnet);
                if (card) {
                    semesterCards.push(card);
                    
                    // -- Renklendirme Mantığı --
                    const status = card.querySelector('.status-select').value;
                    let lessonName = '';
                    if (status === 'repeated with') lessonName = card.dataset.repeatedLesson || '';
                    else {
                        const inp = card.querySelector('.lesson-input') || card.querySelector('.lesson-select');
                        lessonName = inp ? inp.value : '';
                    }

                    // FF Kontrolü
                    const gradeVal = card.querySelector('.grade-input').value;
                    if (status === 'not taken') card.style.background = '#ff4f4f'; // Kırmızı
                    else if (gradeVal === 'FF') card.style.background = '#ff4f4f'; // Kırmızı
                    else if (repeatedLessonsMap.has(lessonName) && status !== 'repeated with') {
                        card.style.background = '#ffa500'; // Turuncu (Tekrar edildiği için etkisi yok)
                    } else {
                        card.style.background = ''; // Normal
                    }
                }
            }
            
            // -- SPA Hesapla (Sadece bu dönem) --
            semesterCards.forEach(card => {
                const status = card.querySelector('.status-select').value;
                let gradeValue = card.querySelector('.grade-input').value;
                let credit = parseFloat(card.querySelector('.credit-input').value);
                let gradeNumeric = gradeMap.hasOwnProperty(gradeValue) ? gradeMap[gradeValue] : parseFloat(gradeValue);
                
                if (isNaN(credit) || credit <= 0) return;

                if (status !== 'not taken') semesterAttempted += credit;

                if (status === 'taken' || status === 'repeated with') {
                    total += gradeNumeric * credit;
                    totalCredits += credit;
                    if (gradeNumeric > 0) semesterCompleted += credit;
                }
            });
            
            const spa = totalCredits > 0 ? (total / totalCredits) : 0;
            
            // -- GPA Hesapla (Running GPA - Zamana Bağlı) --
            const currentRunningStats = calculateRunningGPA(allCards, cellIdx, gradeMap, cardToMagnet);
            
            // -- Ekranı Güncelle --
            const spaDisplay = document.getElementById(`spa-display-${cellIdx}`);
            const semAttDisplay = document.getElementById(`semester-attempted-display-${cellIdx}`);
            const semCompDisplay = document.getElementById(`semester-completed-display-${cellIdx}`);
            const gpaDisplay = document.getElementById(`gpa-display-${cellIdx}`);
            const ovAttDisplay = document.getElementById(`overall-attempted-display-${cellIdx}`);
            const ovCompDisplay = document.getElementById(`overall-completed-display-${cellIdx}`);
            
            if (spaDisplay) spaDisplay.textContent = `SPA: ${spa.toFixed(2)}`;
            if (semAttDisplay) semAttDisplay.textContent = `Semester Attempted: ${semesterAttempted}`;
            if (semCompDisplay) semCompDisplay.textContent = `Semester Completed: ${semesterCompleted}`;
            
            if (gpaDisplay) gpaDisplay.textContent = `GPA: ${currentRunningStats.gpa.toFixed(2)}`;
            if (ovAttDisplay) ovAttDisplay.textContent = `Overall Attempted: ${currentRunningStats.attempted}`;
            if (ovCompDisplay) ovCompDisplay.textContent = `Overall Completed: ${currentRunningStats.completed}`;
        });
        
        // -- Footer (Genel) GPA Güncellemesi --
        // En son dönemi baz alarak genel GPA'yı hesapla
        const lastSemesterIdx = gridCells.length > 0 ? gridCells.length - 1 : 0;
        const finalStats = calculateRunningGPA(allCards, lastSemesterIdx, gradeMap, cardToMagnet);
        
        document.getElementById('gpa-display').textContent = `GPA: ${finalStats.gpa.toFixed(2)}`;
        document.getElementById('total-credit-display').textContent = `Total Credit: ${finalStats.credits}`;
      }

      // calculateGPA çağrılarını yönlendir (Eski kod uyumluluğu için)
      function calculateGPA() {
          calculateGridSPAs();
      }

      // Listen for changes on all relevant fields
      function attachGPAListeners(card) {
        const statusSelect = card.querySelector('.status-select');
        const lessonInput = card.querySelector('.lesson-input');
  
        function updateLessonInput() {
          if (statusSelect.value === 'repeated with') {
            // Only include lessons with DC, DD, or FF grades
            const allCards = Array.from(document.querySelectorAll('.card'));
            const currentCardId = card.id;
            const allowedGrades = ['DC', 'DD', 'FF'];
            const lessonNames = allCards
              .filter(c => c.id !== currentCardId)
              .filter(c => {
                const grade = c.querySelector('.grade-input').value;
                return allowedGrades.includes(grade);
              })
              .map(c => {
                const input = c.querySelector('.lesson-input') || c.querySelector('.lesson-select');
                return input ? input.value : '';
              })
              .filter(name => name && name.trim() !== '');
            // Create select
            const select = document.createElement('select');
            select.className = 'lesson-select';
            select.style.width = '120px';
            lessonNames.forEach(name => {
              const option = document.createElement('option');
              option.value = name;
              option.textContent = name;
              select.appendChild(option);
            });
            // If previously selected, restore
            if (card.dataset.repeatedLesson) {
              select.value = card.dataset.repeatedLesson;
            }
            select.addEventListener('change', () => {
              card.dataset.repeatedLesson = select.value;
              calculateGridSPAs();
            });
            if (lessonInput && lessonInput.parentNode) {
                lessonInput.parentNode.replaceChild(select, lessonInput);
            } else if (card.querySelector('.lesson-select')) {
                 // Already a select, replace it
                 const oldSelect = card.querySelector('.lesson-select');
                 oldSelect.parentNode.replaceChild(select, oldSelect);
            }
            card.dataset.lessonInputType = 'select';
            card.dataset.repeatedLesson = select.value;
          } else {
            // If currently a select, restore to input
            const select = card.querySelector('.lesson-select');
            if (select) {
              const input = document.createElement('input');
              input.type = 'text';
              input.className = 'lesson-input';
              input.value = select.value || '';
              input.style.width = '120px';
              input.addEventListener('input', () => { calculateGridSPAs(); });
              select.parentNode.replaceChild(input, select);
              card.dataset.lessonInputType = 'input';
              delete card.dataset.repeatedLesson;
            }
          }
        }
  
        statusSelect.addEventListener('change', () => {
          updateLessonInput();
          calculateGridSPAs();
        });
        // Also update on card creation
        updateLessonInput();
  
        // GPA listeners
        card.querySelector('.grade-input').addEventListener('input', () => { calculateGridSPAs(); });
        card.querySelector('.credit-input').addEventListener('input', () => { calculateGridSPAs(); });
      }

      // Initial Call
      document.querySelectorAll('.card').forEach(attachGPAListeners);
  
      // Ortak kart HTML fonksiyonu
      function getCardInnerHTML({ lesson, credit, status, grade, isNew }) {
          lesson = lesson || '';
          credit = credit || 3;
          status = status || 'taken';
          grade = grade || 'AA';
          
          // Status select kısmına 'non credit' option'ını ekledik:
          return `
            <div class="card-content">
              <button class="delete-card-btn" title="Delete Card" style="margin-right: 12px; background: #ff4f4f; color: #fff; border: none; border-radius: 6px; font-size: 1.1em; font-weight: bold; padding: 4px 12px; cursor: pointer;">&times;</button>
              <label></label><input type="text" value="${lesson}" class="lesson-input">
              <label>Status:</label>
              <select class="status-select">
                <option value="taken">Taken</option>
                <option value="repeated with">Repeated With</option>
                <option value="not taken">Withdrawwed</option>
                <option value="non credit">Non credit</option> </select>
              <label>Gr:</label>
              <select class="grade-input">
                <option value="AA">AA</option>
                <option value="BA">BA</option>
                <option value="BB">BB</option>
                <option value="CB">CB</option>
                <option value="CC">CC</option>
                <option value="DC">DC</option>
                <option value="DD">DD</option>
                <option value="FF">FF</option>
              </select>
              <label>Cr:</label><input type="number" value="${credit}" min="1" step="1" class="credit-input">
            </div>
          `;
      }
  
      // Add Card Button
      document.getElementById('add-card-btn').addEventListener('click', () => {
        const container = document.getElementById('cards-container');
        const cardCount = document.querySelectorAll('.card').length + 1;
        const card = document.createElement('div');
        card.className = 'card';
        card.id = `card-${Date.now()}`; // Unique ID için timestamp
        // Center of viewport
        const cardWidth = 600;
        const cardHeight = 40;
        const centerX = window.scrollX + (window.innerWidth - cardWidth) / 2;
        const centerY = window.scrollY + (window.innerHeight - cardHeight) / 2;
        card.style.left = `${centerX}px`;
        card.style.top = `${centerY}px`;
        card.innerHTML = getCardInnerHTML({ lesson: `Lesson ${cardCount}`, credit: 3, status: 'taken', grade: 'AA', isNew: true });
        container.appendChild(card);
        // Drag logic
        card.addEventListener('mousedown', (e) => {
          draggingCard = card;
          card.classList.add('dragging');
          originalZ = card.style.zIndex;
          card.style.zIndex = 1000;
          const rect = card.getBoundingClientRect();
          offsetX = e.clientX - rect.left;
          offsetY = e.clientY - rect.top;
          document.body.style.userSelect = 'none';
        });
        attachGPAListeners(card);
        updateCardMagnetMapping(card); // İlk oluşturulduğunda mapping dene
        calculateGridSPAs();
        // Delete button
        const deleteBtn = card.querySelector('.delete-card-btn');
        deleteBtn.addEventListener('click', () => {
          card.remove();
          calculateGridSPAs();
        });
      });
  
      document.querySelectorAll('.origin-input, .lesson-input').forEach(input => {
        input.addEventListener('input', () => { calculateGridSPAs(); });
      });
  
      // --- DYNAMIC GRID ADDITION ---
      let gridCellCount = 1; 
  
      function createGridCell(cellIdx) {
        const gridCell = document.createElement('div');
        gridCell.className = 'grid-cell';
        gridCell.innerHTML = `
          <div class="grid-cell-header">
            <button class="delete-grid-btn" title="Delete Grid" style="margin-right: 16px; background: #ff4f4f; color: #fff; border: none; border-radius: 6px; font-size: 1.1em; font-weight: bold; padding: 4px 12px; cursor: pointer;">&times;</button>
            <input type="text" class="semester-name-input" value="Semester ${cellIdx + 1}" style="margin-right: 12px; width: 120px; font-weight: bold;">
            <span class="spa-display" id="spa-display-${cellIdx}">SPA: 0.00</span>
            <span class="semester-attempted-display" id="semester-attempted-display-${cellIdx}">Semester Attempted: 0</span>
            <span class="semester-completed-display" id="semester-completed-display-${cellIdx}">Semester Completed: 0</span>
            <span class="overall-attempted-display" id="overall-attempted-display-${cellIdx}">Overall Attempted: 0</span>
            <span class="overall-completed-display" id="overall-completed-display-${cellIdx}">Overall Completed: 0</span>
            <span class="gpa-display" id="gpa-display-${cellIdx}">GPA: 0.00</span>
          </div>
          <div class="magnets-container"></div>
        `;
        // Delete logic
        const deleteBtn = gridCell.querySelector('.delete-grid-btn');
        deleteBtn.addEventListener('click', () => {
          const gridCells = Array.from(document.querySelectorAll('.grid-cell'));
          const semesterIdx = gridCells.indexOf(gridCell);
          if (semesterIdx === -1) return;
  
          // Magnetlere bağlı kartları sil
          const magnetsToDelete = gridCell.querySelectorAll('.magnet');
          magnetsToDelete.forEach(magnet => {
            const card = magnetToCard.get(magnet);
            if (card) {
              card.remove();
              cardToMagnet.delete(card);
              magnetToCard.delete(magnet);
            }
          });
  
          gridCell.remove();
  
          // Diğer semesterları güncelle (Index kaydırma)
          const allGridCells = Array.from(document.querySelectorAll('.grid-cell'));
          for (let i = semesterIdx; i < allGridCells.length; i++) {
            const cell = allGridCells[i];
            const header = cell.querySelector('.grid-cell-header');
            if (header) {
              header.querySelector('.spa-display').id = `spa-display-${i}`;
              header.querySelector('.semester-attempted-display').id = `semester-attempted-display-${i}`;
              header.querySelector('.semester-completed-display').id = `semester-completed-display-${i}`;
              header.querySelector('.overall-attempted-display').id = `overall-attempted-display-${i}`;
              header.querySelector('.overall-completed-display').id = `overall-completed-display-${i}`;
              header.querySelector('.gpa-display').id = `gpa-display-${i}`;
            }
            // Magnet ID güncelleme
            const magnets = cell.querySelectorAll('.magnet');
            magnets.forEach((magnet, mIdx) => {
              const newData = `${i}-${mIdx}`;
              const card = magnetToCard.get(magnet);
              if (card) {
                magnet.dataset.magnet = newData;
              } else {
                magnet.dataset.magnet = newData;
              }
            });
          }
          createMagnets();
          updateMagnets();
          remapAllCardsToMagnets();
          calculateGridSPAs();
        });
        return gridCell;
      }
  
      document.getElementById('add-grid-btn').addEventListener('click', () => {
        gridCellCount++;
        const gridContainer = document.getElementById('grid-container');
        const newCell = createGridCell(document.querySelectorAll('.grid-cell').length);
        gridContainer.appendChild(newCell);
        createMagnets();
        updateMagnets();
        remapAllCardsToMagnets();
        calculateGridSPAs();
      });
  
      function createMagnets() {
        const gridCells = document.querySelectorAll('.grid-cell');
        gridCells.forEach((cell, cellIdx) => {
          const container = cell.querySelector('.magnets-container');
          // Sadece boşsa doldur (var olan magnetleri koru)
          if(container.children.length > 0) return;

          container.innerHTML = '';
          const rows = 4;
          const cols = 2;
          const count = rows * cols;
          for (let i = 0; i < count; i++) {
            const magnet = document.createElement('div');
            magnet.className = 'magnet';
            magnet.dataset.magnet = `${cellIdx}-${i}`;
            const row = Math.floor(i / cols);
            const col = i % cols;
            const lefts = [25, 75];
            magnet.style.left = `${lefts[col]}%`;
            // Header için alan bırakarak daha kompakt yerleşim
            const topOffset = 15; // Header için üstten boşluk (%)
            const availableHeight = 100 - topOffset - 5; // Alt boşluk için 5%
            magnet.style.top = `${topOffset + ((row + 0.5) / rows) * availableHeight}%`;
            container.appendChild(magnet);
          }
        });
      }
  
      const cards = document.querySelectorAll('.card');
      let draggingCard = null;
      let offsetX = 0, offsetY = 0;
      let originalZ = 10;
  
      function updateMagnets() {
        magnets = Array.from(document.querySelectorAll('.magnet'));
      }
      
      // Initial Setup
      const gridContainer = document.getElementById('grid-container');
      if (gridContainer.children.length === 0) {
           gridContainer.appendChild(createGridCell(0));
      }
      createMagnets();
      updateMagnets();
  
      function updateCardMagnetMapping(card) {
        if (cardToMagnet.has(card)) {
          const prevMagnet = cardToMagnet.get(card);
          magnetToCard.delete(prevMagnet);
          cardToMagnet.delete(card);
        }
        const cardRect = card.getBoundingClientRect();
        const cardCenterX = cardRect.left + card.offsetWidth / 2 + window.scrollX;
        const cardCenterY = cardRect.top + card.offsetHeight / 2 + window.scrollY;
        for (const magnet of magnets) {
          if (magnetToCard.has(magnet) && magnetToCard.get(magnet) !== card) continue;
          const center = getCenter(magnet);
          const dx = cardCenterX - center.x;
          const dy = cardCenterY - center.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < magnetRadius) {
            cardToMagnet.set(card, magnet);
            magnetToCard.set(magnet, card);
            break;
          }
        }
      }

      function remapAllCardsToMagnets() {
        cardToMagnet.clear();
        magnetToCard.clear();
        const allCards = Array.from(document.querySelectorAll('.card'));
        const allMagnets = Array.from(document.querySelectorAll('.magnet'));
        
        allCards.forEach(card => {
          const cardRect = card.getBoundingClientRect();
          const cardCenterX = cardRect.left + card.offsetWidth / 2 + window.scrollX;
          const cardCenterY = cardRect.top + card.offsetHeight / 2 + window.scrollY;
          let closestMagnet = null;
          let closestDist = Infinity;
          
          for (const magnet of allMagnets) {
            if (magnetToCard.has(magnet)) continue;
            const center = getCenter(magnet);
            const dx = cardCenterX - center.x;
            const dy = cardCenterY - center.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < magnetRadius && dist < closestDist) {
              closestDist = dist;
              closestMagnet = magnet;
            }
          }
          if (closestMagnet) {
            cardToMagnet.set(card, closestMagnet);
            magnetToCard.set(closestMagnet, card);
          }
        });
      }
  
      // --- DRAG EVENTS ---
      cards.forEach(card => {
        card.addEventListener('mousedown', (e) => {
          draggingCard = card;
          card.classList.add('dragging');
          originalZ = card.style.zIndex;
          card.style.zIndex = 1000;
          const rect = card.getBoundingClientRect();
          offsetX = e.clientX - rect.left;
          offsetY = e.clientY - rect.top;
          document.body.style.userSelect = 'none';
        });
      });
  
      document.addEventListener('mousemove', (e) => {
        if (!draggingCard) return;
        updateMagnets();
        let x = e.clientX - offsetX + window.scrollX;
        let y = e.clientY - offsetY + window.scrollY;
        draggingCard.style.left = x + 'px';
        draggingCard.style.top = y + 'px';
  
        // Snap logic
        let snapped = false;
        let snappedMagnet = null;
        for (const magnet of magnets) {
          if (magnetToCard.has(magnet) && magnetToCard.get(magnet) !== draggingCard) continue;
          const center = getCenter(magnet);
          const dx = x + draggingCard.offsetWidth/2 - center.x;
          const dy = y + draggingCard.offsetHeight/2 - center.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < magnetRadius) {
            draggingCard.style.left = (center.x - draggingCard.offsetWidth/2) + 'px';
            draggingCard.style.top = (center.y - draggingCard.offsetHeight/2) + 'px';
            snapped = true;
            snappedMagnet = magnet;
            break;
          }
        }
        if (snapped) {
          if (cardToMagnet.has(draggingCard)) {
            const prevMagnet = cardToMagnet.get(draggingCard);
            magnetToCard.delete(prevMagnet);
          }
          cardToMagnet.set(draggingCard, snappedMagnet);
          magnetToCard.set(snappedMagnet, draggingCard);
        } else {
           // Snap bozulduysa mapping'i silmeyelim, mouseup'ta bakarız
           // Ama anlık hesaplama için geçici silebiliriz, veya mouseup bekleriz.
           // Mouseup'ta remap yapmak daha güvenli.
        }
        // calculateGridSPAs(); // Mouse move'da sürekli hesaplama yorabilir, isteğe bağlı açılabilir.
      });
  
      document.addEventListener('mouseup', (e) => {
        updateMagnets();
        if (draggingCard) {
          draggingCard.classList.remove('dragging');
          draggingCard.style.zIndex = originalZ;
          
          // Check snap final
          let stillSnapped = false;
          for (const magnet of magnets) {
            const center = getCenter(magnet);
            const dx = draggingCard.offsetLeft + draggingCard.offsetWidth/2 - center.x + window.scrollX;
            const dy = draggingCard.offsetTop + draggingCard.offsetHeight/2 - center.y + window.scrollY;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < magnetRadius) {
              stillSnapped = true;
              break;
            }
          }
          if (!stillSnapped && cardToMagnet.has(draggingCard)) {
            const prevMagnet = cardToMagnet.get(draggingCard);
            magnetToCard.delete(prevMagnet);
            cardToMagnet.delete(draggingCard);
          }

          draggingCard = null;
          document.body.style.userSelect = '';
          calculateGridSPAs();
        }
      });
  
      // --- SAVE / LOAD ---
      function getAllCardsData() {
        const cards = document.querySelectorAll('.card');
        return Array.from(cards).map(card => {
          const status = card.querySelector('.status-select').value;
          let lesson = '';
          let lessonInputType = card.dataset.lessonInputType || 'input';
          if (status === 'repeated with') {
            lesson = card.dataset.repeatedLesson || '';
            lessonInputType = 'select';
          } else {
            const input = card.querySelector('.lesson-input') || card.querySelector('.lesson-select');
            lesson = input ? input.value : '';
          }
          return {
            id: card.id,
            top: card.style.top,
            left: card.style.left,
            lesson,
            lessonInputType,
            status,
            grade: card.querySelector('.grade-input').value,
            credit: card.querySelector('.credit-input').value,
            repeatedLesson: card.dataset.repeatedLesson || ''
          };
        });
      }
  
      function getAllSemestersData() {
        const gridCells = document.querySelectorAll('.grid-cell');
        const semesters = [];
        
        gridCells.forEach((cell, cellIdx) => {
          const name = cell.querySelector('.semester-name-input')
            ? cell.querySelector('.semester-name-input').value
            : `Semester ${cellIdx + 1}`;
            
          const cards = [];
          // HATA DÜZELTİLDİ: m < 6 yerine m < 8 yapıldı (Grid kapasitesi kadar)
          for (let m = 0; m < 8; m++) { 
            const magnet = cell.querySelector(`.magnet[data-magnet='${cellIdx}-${m}']`);
            if (!magnet) continue;
            const card = magnetToCard.get(magnet);
            if (card) cards.push(card.id);
          }
          semesters.push({ name, cards });
        });
        
        return semesters;
      }
  
      document.getElementById('save-btn').addEventListener('click', () => {
        const data = {
          semesters: getAllSemestersData(),
          cards: getAllCardsData()
        };
        let filename = prompt('Enter a filename:', 'cards-data');
        if (!filename) return;
        if (!filename.endsWith('.json')) filename += '.json';
        const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 0);
      });
  
      function createCardFromData(data) {
        const card = document.createElement('div');
        card.className = 'card';
        card.id = data.id;
        card.style.top = data.top;
        card.style.left = data.left;
        card.innerHTML = getCardInnerHTML({ lesson: data.lesson, credit: data.credit, status: data.status, grade: data.grade, isNew: false });
        card.querySelector('.status-select').value = data.status;
        card.querySelector('.grade-input').value = data.grade;
        if (data.status === 'repeated with') {
          card.dataset.repeatedLesson = data.repeatedLesson || data.lesson;
          card.dataset.lessonInputType = 'select';
        } else {
          card.dataset.lessonInputType = 'input';
        }
        attachGPAListeners(card);
        card.addEventListener('mousedown', (e) => {
          draggingCard = card;
          card.classList.add('dragging');
          originalZ = card.style.zIndex;
          card.style.zIndex = 1000;
          const rect = card.getBoundingClientRect();
          offsetX = e.clientX - rect.left;
          offsetY = e.clientY - rect.top;
          document.body.style.userSelect = 'none';
        });
        const deleteBtn = card.querySelector('.delete-card-btn');
        deleteBtn.addEventListener('click', () => {
          card.remove();
          calculateGridSPAs();
        });
        return card;
      }
  
      document.getElementById('load-btn').addEventListener('click', () => {
        document.getElementById('load-input').click();
      });
  
      document.getElementById('load-input').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(evt) {
          try {
            const data = JSON.parse(evt.target.result);
            const container = document.getElementById('cards-container');
            container.innerHTML = '';
            const gridContainer = document.getElementById('grid-container');
            gridContainer.innerHTML = '';
            
            // Semesters
            data.semesters.forEach((semester, idx) => {
              const gridCell = createGridCell(idx);
              const nameInput = gridCell.querySelector('.semester-name-input');
              if (nameInput) nameInput.value = semester.name;
              gridContainer.appendChild(gridCell);
            });
            createMagnets();
            updateMagnets();
  
            // Cards
            const loadedCards = [];
            data.cards.forEach(cardData => {
              const card = createCardFromData(cardData);
              container.appendChild(card);
              loadedCards.push(card);
            });
  
            // Mapping
            data.semesters.forEach((semester, cellIdx) => {
              semester.cards.forEach((cardId, mIdx) => {
                const card = loadedCards.find(c => c.id === cardId);
                const magnet = document.querySelector(`.magnet[data-magnet='${cellIdx}-${mIdx}']`);
                if (card && magnet) {
                  const center = getCenter(magnet);
                  card.style.left = (center.x - card.offsetWidth/2) + 'px';
                  card.style.top = (center.y - card.offsetHeight/2) + 'px';
                  cardToMagnet.set(card, magnet);
                  magnetToCard.set(magnet, card);
                }
              });
            });
            
            document.querySelectorAll('.origin-input, .lesson-input').forEach(input => {
                input.addEventListener('input', () => { calculateGridSPAs(); });
            });
            calculateGridSPAs();
          } catch (err) {
            alert('Failed to load file: ' + err.message);
          }
        };
        reader.readAsText(file);
        e.target.value = '';
      });
      
      // Initial calculation
      calculateGridSPAs();