let stonesData = [];
let lookupData = {
    colors: {},
    days: {},
    months: {},
    tzodiacs: {},
    ezodiacs: {},
    chakra: {},
    groups: {},
    hardness: {},
    power: {},
    element: {},
    numerology: {},
    usage: {},
    cleansing: {},
    rarity: {},
    price_range: {}
};

// โหลดข้อมูลเมื่อเริ่มต้น
document.addEventListener('DOMContentLoaded', async function() {
    await loadData();
    await loadLookupData();
    initializeFilters();
    
    // เพิ่ม Enter key ให้กับอินพุตชื่อหิน
    document.getElementById('stoneName').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
});

// ตัวจัดการการค้นหา (เลือกโหมด)
function handleSearch() {
    const filterMode = document.getElementById('filterMode');
    if (filterMode.style.display === 'none') {
        // โหมดวันเกิด
        searchByBirthday();
    } else {
        // โหมดตัวกรอง
        searchStones();
    }
}

// โหลด JSON data
async function loadData() {
    try {
        const response = await fetch('./stones_data.json');
        if (!response.ok) throw new Error('Failed to load stones_data.json');
        stonesData = await response.json();
        console.log('Loaded ' + stonesData.length + ' stones');
    } catch (error) {
        console.error('Error loading stones data:', error);
        document.getElementById('results').innerHTML = '<div class="empty-state"><p>⚠️ เกิดข้อผิดพลาดในการโหลดข้อมูล</p></div>';
    }
}

// โหลด lookup data
async function loadLookupData() {
    const lookups = ['colors', 'days', 'months', 'zodiacs_th', 'zodiacs_en', 'chakra', 'groups', 'hardness', 'power', 'element', 'numerology', 'usage', 'cleansing', 'rarity', 'price_range'];
    
    for (let lookup of lookups) {
        try {
            const filename = lookup === 'zodiacs_th' ? './lookup_zodiacs_th.json' :
                           lookup === 'zodiacs_en' ? './lookup_zodiacs_en.json' :
                           lookup === 'element' ? './lookup_element.json' :
                           lookup === 'numerology' ? './lookup_numerology.json' :
                           lookup === 'usage' ? './lookup_usage.json' :
                           lookup === 'cleansing' ? './lookup_cleansing.json' :
                           lookup === 'rarity' ? './lookup_rarity.json' :
                           lookup === 'price_range' ? './lookup_price_range.json' :
                           `./lookup_${lookup}.json`;
            
            const response = await fetch(filename);
            if (!response.ok) {
                console.warn('Failed to fetch ' + lookup + ': ' + response.status);
                continue;
            }
            const data = await response.json();
            
            const key = lookup === 'zodiacs_th' ? 'tzodiacs' :
                       lookup === 'zodiacs_en' ? 'ezodiacs' : lookup;
            
            data.forEach(item => {
                lookupData[key][item.id] = item;
            });
            console.log('Loaded ' + lookup + ' (' + data.length + ' items)');
        } catch (error) {
            console.warn('Could not load ' + lookup, error);
        }
    }
}

// เริ่มต้น Filter Dropdowns
function initializeFilters() {
    // Colors
    const colorSelect = document.getElementById('stoneColor');
    Object.keys(lookupData.colors).forEach(id => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = lookupData.colors[id].name_th || lookupData.colors[id].name_en;
        colorSelect.appendChild(option);
    });
    
    // Days
    const daySelect = document.getElementById('stoneDay');
    Object.keys(lookupData.days).forEach(id => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = lookupData.days[id].name;
        daySelect.appendChild(option);
    });
    
    // Months
    const monthSelect = document.getElementById('stoneMonth');
    Object.keys(lookupData.months).forEach(id => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = lookupData.months[id].name;
        monthSelect.appendChild(option);
    });
    
    // Zodiacs Thai
    const zodiacThSelect = document.getElementById('stoneZodiacTh');
    Object.keys(lookupData.tzodiacs).forEach(id => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = lookupData.tzodiacs[id].name || lookupData.tzodiacs[id].name_th;
        zodiacThSelect.appendChild(option);
    });
    
    // Zodiacs English
    const zodiacEnSelect = document.getElementById('stoneZodiacEn');
    Object.keys(lookupData.ezodiacs).forEach(id => {
        const option = document.createElement('option');
        option.value = id;
        const nameTh = lookupData.ezodiacs[id].name_th || lookupData.ezodiacs[id].name;
        const nameEn = lookupData.ezodiacs[id].name_en || lookupData.ezodiacs[id].english_name;
        option.textContent = nameTh + ' (' + nameEn + ')';
        zodiacEnSelect.appendChild(option);
    });
    
    // Chakra
    const chakraSelect = document.getElementById('stoneChakra');
    Object.keys(lookupData.chakra).forEach(id => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = lookupData.chakra[id].name_th;
        chakraSelect.appendChild(option);
    });
    
    // Groups
    const groupSelect = document.getElementById('stoneGroup');
    Object.keys(lookupData.groups).forEach(id => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = lookupData.groups[id].name;
        groupSelect.appendChild(option);
    });
    
    // Hardness
    const hardnessSelect = document.getElementById('stoneHardness');
    Object.keys(lookupData.hardness).forEach(id => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = 'ระดับ ' + id + ' - ' + lookupData.hardness[id].level;
        hardnessSelect.appendChild(option);
    });
    
    // Power
    const powerSelect = document.getElementById('stonePower');
    Object.keys(lookupData.power).forEach(id => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = 'ระดับ ' + id + ' - ' + (lookupData.power[id].name || 'พลัง ' + id);
        powerSelect.appendChild(option);
    });
}

// ฟังก์ชันค้นหา
function searchStones() {
    const stoneName = document.getElementById('stoneName').value.toLowerCase();
    const selectedColor = document.getElementById('stoneColor').value;
    const selectedDay = document.getElementById('stoneDay').value;
    const selectedMonth = document.getElementById('stoneMonth').value;
    const selectedZodiacTh = document.getElementById('stoneZodiacTh').value;
    const selectedZodiacEn = document.getElementById('stoneZodiacEn').value;
    const selectedChakra = document.getElementById('stoneChakra').value;
    const selectedGroup = document.getElementById('stoneGroup').value;
    const hardness = document.getElementById('stoneHardness').value;
    const power = document.getElementById('stonePower').value;
    
    // เก็บข้อมูลวันที่เลือกสำหรับแสดงผล
    let dayInfo = null;
    if (selectedDay) {
        dayInfo = lookupData.days[parseInt(selectedDay)];
    }
    
    let results = stonesData.filter(stone => {
        // ชื่อหิน
        if (stoneName && 
            !stone.english_name.toLowerCase().includes(stoneName) && 
            !stone.thai_name.toLowerCase().includes(stoneName)) {
            return false;
        }
        
        // สี
        if (selectedColor) {
            const stoneColors = (stone.colors || '').toString().split(' ').filter(c => c);
            if (!stoneColors.includes(selectedColor)) return false;
        }
        
        // วัน + สีมงคล
        if (selectedDay) {
            const stoneDays = (stone.days || '').toString().split(' ').filter(d => d);
            if (!stoneDays.includes(selectedDay)) return false;
            
            // ตรวจสอบสีมงคลของวัน
            if (dayInfo && dayInfo.lucky_color) {
                const luckyColors = dayInfo.lucky_color.split(',').map(c => c.trim());
                const stoneColorIds = (stone.colors || '').toString().split(' ').filter(c => c);
                const stoneColorNames = stoneColorIds.map(id => {
                    const color = lookupData.colors[parseInt(id)];
                    return color ? color.name_th : '';
                }).filter(n => n);
                
                // ตรวจสอบว่าหินมีสีที่ตรงกับสีมงคลหรือไม่
                const hasLuckyColor = luckyColors.some(luckyColor => 
                    stoneColorNames.some(stoneColor => 
                        stoneColor.includes(luckyColor) || luckyColor.includes(stoneColor)
                    )
                );
                
                if (!hasLuckyColor) return false;
            }
        }
        
        // เดือน
        if (selectedMonth) {
            const stoneMonths = (stone.months || '').toString().split(' ').filter(m => m);
            if (!stoneMonths.includes(selectedMonth)) return false;
        }
        
        // ปีนักษัตร
        if (selectedZodiacTh) {
            const stoneZodiacsTh = (stone.tzodiacs || '').toString().split(' ').filter(z => z);
            if (!stoneZodiacsTh.includes(selectedZodiacTh)) return false;
        }
        
        // ราศี
        if (selectedZodiacEn) {
            const stoneZodiacsEn = (stone.ezodiacs || '').toString().split(' ').filter(z => z);
            if (!stoneZodiacsEn.includes(selectedZodiacEn)) return false;
        }
        
        // จักระ
        if (selectedChakra) {
            const stoneChakras = (stone.chakra || '').toString().split(' ').filter(c => c);
            if (!stoneChakras.includes(selectedChakra)) return false;
        }
        
        // กลุ่มมงคล
        if (selectedGroup) {
            const stoneGroups = (stone.groups || '').toString().split(' ').filter(g => g);
            if (!stoneGroups.includes(selectedGroup)) return false;
        }
        
        // ความแข็ง
        if (hardness && stone.shardness != hardness) {
            return false;
        }
        
        // ระดับพลัง
        if (power && stone.spower != power) {
            return false;
        }
        
        return true;
    });
    
    displayResults(results, dayInfo);
}

// แสดงผลลัพธ์
function displayResults(results, dayInfo) {
    const resultsDiv = document.getElementById('results');
    const resultCount = document.getElementById('resultCount');
    const dayInfoDiv = document.getElementById('dayInfo');
    
    // Limit ผลลัพธ์ที่ 50 รายการแรก
    const displayResults = results.slice(0, 50);
    resultCount.textContent = results.length + (results.length > 50 ? ' (แสดง 50 รายการแรก)' : '');
    
    // แสดงข้อมูลวันที่เลือก
    if (dayInfo) {
        dayInfoDiv.innerHTML = `
            <div style="background: #f0f9ff; padding: 12px; border-radius: 6px; margin-bottom: 12px; border-left: 4px solid #667eea;">
                <strong>🗓️ เลือกเงื่อนไขวัน: ${dayInfo.name}</strong><br>
                <span style="color: #22c55e;">✨ สีมงคล: ${dayInfo.lucky_color}</span><br>
                <span style="color: #ef4444;">⚠️ สีอัปมงคล: ${dayInfo.unlucky_color}</span>
            </div>
        `;
    } else {
        dayInfoDiv.innerHTML = '';
    }
    
    if (results.length === 0) {
        resultsDiv.innerHTML = '<div class="empty-state"><p>😕 ไม่พบหินที่ตรงกับเงื่อนไขของคุณ</p></div>';
        return;
    }
    
    resultsDiv.innerHTML = displayResults.map(stone => `
        <div class="stone-card" data-stone-id="${stone.id}">
            <div class="stone-detail" style="cursor: pointer;">
                <div class="stone-name">${stone.english_name}</div>
                <div class="stone-thai">${stone.thai_name}</div>
                <div class="stone-info">
                    <span>💪 ความแข็ง: ระดับ ${stone.shardness}</span>
                    <span>⚡ พลัง: ระดับ ${stone.spower}</span>
                    <span>🎨 สีหิน: ${getColorNames(stone.colors)}</span>
                </div>
            </div>
            <div class="card-actions">
                <button type="button" class="search-btn google" data-action="google" data-name="${stone.english_name}" data-name-th="${stone.thai_name}" title="ค้นหาภาพใน Google">G</button>
                <button type="button" class="search-btn etsy" data-action="etsy" data-name="${stone.english_name}" title="ค้นหาใน Etsy">E</button>
            </div>
        </div>
    `).join('');
    
    // เพิ่ม event listeners
    document.querySelectorAll('.stone-card').forEach(card => {
        const detailDiv = card.querySelector('.stone-detail');
        const stoneId = parseInt(card.getAttribute('data-stone-id'));
        
        detailDiv.addEventListener('click', function() {
            console.log('Card clicked, stone ID:', stoneId);
            showStoneDetail(stoneId);
        });
    });
    
    document.querySelectorAll('.search-btn.google').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const name = this.getAttribute('data-name');
            const nameTh = this.getAttribute('data-name-th');
            window.searchGoogleImages(name, nameTh);
        });
    });
    
    document.querySelectorAll('.search-btn.etsy').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const name = this.getAttribute('data-name');
            window.searchEtsy(name);
        });
    });
}

// ฟังก์ชันช่วยแปลง ID เป็นชื่อ
function getColorNames(colorIds) {
    if (!colorIds) return '-';
    const ids = colorIds.toString().split(/[\s,]+/).filter(id => id);
    const names = ids.map(id => {
        const color = lookupData.colors[id];
        return color ? (color.name_th || color.name_en || id) : id;
    }).filter(name => name !== '-');
    return names.length > 0 ? names.join(', ') : '-';
}

function getDayNames(dayIds) {
    if (!dayIds) return '-';
    const ids = dayIds.toString().split(/[\s,]+/).filter(id => id);
    const names = ids.map(id => {
        const day = lookupData.days[id];
        return day ? (day.name || day.name_th || id) : id;
    }).filter(name => name !== '-');
    return names.length > 0 ? names.join(', ') : '-';
}

function getMonthNames(monthIds) {
    if (!monthIds) return '-';
    const ids = monthIds.toString().split(/[\s,]+/).filter(id => id);
    const names = ids.map(id => {
        const month = lookupData.months[id];
        return month ? (month.name || month.name_th || id) : id;
    }).filter(name => name !== '-');
    return names.length > 0 ? names.join(', ') : '-';
}

function getZodiacThNames(zodiacIds) {
    if (!zodiacIds) return '-';
    const ids = zodiacIds.toString().split(/[\s,]+/).filter(id => id);
    const names = ids.map(id => {
        const zodiac = lookupData.tzodiacs[id];
        return zodiac ? (zodiac.name_th || zodiac.name || id) : id;
    }).filter(name => name !== '-');
    return names.length > 0 ? names.join(', ') : '-';
}

function getZodiacEnNames(zodiacIds) {
    if (!zodiacIds) return '-';
    const ids = zodiacIds.toString().split(/[\s,]+/).filter(id => id);
    const names = ids.map(id => {
        const zodiac = lookupData.ezodiacs[id];
        if (!zodiac) return id;
        const th = zodiac.name_th || '';
        const en = zodiac.name_en || '';
        return th && en ? `${th} (${en})` : (th || en || id);
    }).filter(name => name !== '-' && name !== '');
    return names.length > 0 ? names.join(', ') : '-';
}

function getChakraNames(chakraIds) {
    if (!chakraIds) return '-';
    const ids = chakraIds.toString().split(/[\s,]+/).filter(id => id);
    const names = ids.map(id => {
        const chakra = lookupData.chakra[id];
        if (!chakra) return id;
        let result = chakra.name_th || chakra.name || id;
        if (chakra.location) {
            result += ' (' + chakra.location + ')';
        }
        return result;
    }).filter(name => name !== '-');
    return names.length > 0 ? names.join(', ') : '-';
}

function getElementName(elementId) {
    if (!elementId) return '-';
    const element = lookupData.element[elementId];
    if (!element) return '-';
    let result = element.name_th || element.name || '-';
    if (element.description) {
        result += ': ' + element.description;
    }
    return result;
}

function getNumerologyName(numerologyId) {
    if (!numerologyId) return '-';
    const numId = parseInt(numerologyId);
    const numerology = lookupData.numerology[numId];
    if (!numerology) return '-';
    let result = 'เลข ' + (numerology.number || numId);
    if (numerology.auspice_detail) {
        result += ' - ' + numerology.auspice_detail;
    }
    return result;
}

function getNumerologyNames(numerologyIds) {
    if (!numerologyIds) return '-';
    const ids = numerologyIds.toString().split(/[\s,]+/).filter(id => id);
    const names = ids.map(id => {
        const numId = parseInt(id);
        const numerology = lookupData.numerology[numId];
        if (!numerology) return id;
        return 'เลข ' + (numerology.number || numId);
    }).filter(name => name !== '-');
    return names.length > 0 ? names.join(', ') : '-';
}

function getGroupNames(groupIds) {
    if (!groupIds) return '-';
    const ids = groupIds.toString().split(/[\s,]+/).filter(id => id);
    const names = ids.map(id => {
        const group = lookupData.groups[id];
        return group ? (group.name || group.name_th || id) : id;
    }).filter(name => name !== '-');
    return names.length > 0 ? names.join(', ') : '-';
}

function getUsageNames(usageIds) {
    if (!usageIds) return '-';
    const ids = usageIds.toString().split(/[\s,]+/).filter(id => id);
    const names = ids.map(id => {
        const numId = parseInt(id);
        const usage = lookupData.usage[numId];
        return usage ? (usage.name || usage.name_th || id) : id;
    }).filter(name => name !== '-');
    return names.length > 0 ? names.join(', ') : '-';
}

function getCleansingNames(cleansingIds) {
    if (!cleansingIds) return '-';
    const ids = cleansingIds.toString().split(/[\s,]+/).filter(id => id);
    const names = ids.map(id => {
        const numId = parseInt(id);
        const cleansing = lookupData.cleansing[numId];
        return cleansing ? (cleansing.name || cleansing.name_th || id) : id;
    }).filter(name => name !== '-');
    return names.length > 0 ? names.join(', ') : '-';
}

function getUsageDetails(usageIds) {
    if (!usageIds) return '';
    const ids = usageIds.toString().split(/[\s,]+/).filter(id => id);
    const details = ids.map(id => {
        const numId = parseInt(id);
        const usage = lookupData.usage[numId];
        if (!usage) return '';
        let detail = `<div class="detail-item">
            <strong>${usage.name || '-'}</strong>
            ${usage.history ? `<p><em>${usage.history}</em></p>` : ''}
            ${usage.auspice_detail ? `<p>✨ ${usage.auspice_detail}</p>` : ''}
            ${usage.description ? `<p>${usage.description}</p>` : ''}
        </div>`;
        return detail;
    }).filter(d => d);
    return details.length > 0 ? details.join('') : '';
}

function getCleansingDetails(cleansingIds) {
    if (!cleansingIds) return '';
    const ids = cleansingIds.toString().split(/[\s,]+/).filter(id => id);
    const details = ids.map(id => {
        const numId = parseInt(id);
        const cleansing = lookupData.cleansing[numId];
        if (!cleansing) return '';
        let detail = `<div class="detail-item">
            <strong>${cleansing.name || '-'}</strong>
            ${cleansing.history ? `<p><em>${cleansing.history}</em></p>` : ''}
            ${cleansing.auspice_detail ? `<p>✨ ${cleansing.auspice_detail}</p>` : ''}
            ${cleansing.description ? `<p>${cleansing.description}</p>` : ''}
        </div>`;
        return detail;
    }).filter(d => d);
    return details.length > 0 ? details.join('') : '';
}

function getRarityName(rarityId) {
    if (!rarityId) return '-';
    const rarity = lookupData.rarity[rarityId];
    return rarity ? (rarity.name || rarity.name_th || '-') : '-';
}

function getPriceRangeName(priceId) {
    if (!priceId) return '-';
    const price = lookupData.price_range[priceId];
    if (!price) return '-';
    let result = price.name || '-';
    if (price.range) {
        result += ' (' + price.range + ' บาท)';
    }
    return result;
}

function getHardnessName(hardnessId) {
    if (!hardnessId) return '-';
    const hardness = lookupData.hardness[hardnessId];
    if (!hardness) {
        console.warn('Hardness ID ' + hardnessId + ' not found in lookup');
        return '-';
    }
    let result = (hardness.level || hardnessId);
    if (hardness.description) {
        result += ' - ' + hardness.description;
    }
    if (hardness.comparison) {
        result += ' (' + hardness.comparison + ')';
    }
    return result;
}

function getPowerName(powerId) {
    if (!powerId) return '-';
    const power = lookupData.power[powerId];
    if (!power) {
        console.warn('Power ID ' + powerId + ' not found in lookup');
        return '-';
    }
    
    let result = power.name || (powerId);
    if (power.body_point) {
        result += ' (' + power.body_point + ')';
    }
    if (power.description) {
        result += ' - ' + power.description;
    }
    return result;
}

// แสดงรายละเอียดหิน
function showStoneDetail(stoneId) {
    console.log('Opening detail for stone ID:', stoneId);
    const numId = parseInt(stoneId);
    const stone = stonesData.find(s => s.id === numId);
    console.log('Found stone:', stone);
    if (!stone) {
        console.warn('Stone not found with ID:', stoneId);
        return;
    }
    
    const modalBody = document.getElementById('modalBody');
    let htmlContent = `
                <div class="modal-actions">
                    <button type="button" class="action-btn google" onclick="window.searchGoogleImages('${stone.english_name}', '${stone.thai_name}')" title="ค้นหาภาพสร้อยข้อมือใน Google">
                        🔍 Google Images
                    </button>
                    <button type="button" class="action-btn etsy" onclick="window.searchEtsy('${stone.english_name}')" title="ค้นหาสร้อยข้อมือใน Etsy">
                        🛒 Etsy
                    </button>
                    <button type="button" class="action-btn text" onclick="window.exportToText(${stone.id})" title="ส่งออกเป็นไฟล์ Text">
                        📄 Export Text
                    </button>
                    <button type="button" class="action-btn pdf" onclick="window.exportToPDF(${stone.id})" title="ส่งออกเป็น PDF">
                        📑 Export PDF
                    </button>
                </div>
        
        <div class="detail-title">
            <h2><span class="english-name">${stone.english_name}</span> (${stone.thai_name})${stone.other_name ? ' - ' + stone.other_name : ''}</h2>
        </div>
        
        <div class="detail-grid-columns">
    `;
    
    // คอลัมน์ซ้าย
    htmlContent += `<div class="detail-column">`;
    
    // คำอธิบาย
    if (stone.description) {
        htmlContent += `
        <div class="detail-section">
            <h4>📖 คำอธิบาย</h4>
            <p>${stone.description}</p>
        </div>
        `;
    }
    
    // ทะเบียนสุริยคติและจันทรคติ (ย้ายไปคอลัมน์ซ้าย)
    htmlContent += `
    <div class="detail-section">
        <h4>📅 ทะเบียนสุริยคติและจันทรคติ</h4>
        <div class="compact-info">
            <div class="info-row">
                <span class="info-label">วัน:</span>
                <span class="info-value">${getDayNames(stone.days)}</span>
            </div>
            <div class="info-row">
                <span class="info-label">เดือน:</span>
                <span class="info-value">${getMonthNames(stone.months)}</span>
            </div>
            <div class="info-row">
                <span class="info-label">ปีนักษัตร:</span>
                <span class="info-value">${getZodiacThNames(stone.tzodiacs)}</span>
            </div>
            <div class="info-row">
                <span class="info-label">ราศี:</span>
                <span class="info-value">${getZodiacEnNames(stone.ezodiacs)}</span>
            </div>
            <div class="info-row">
                <span class="info-label">หมวดหมู่:</span>
                <span class="info-value">${getGroupNames(stone.groups)}</span>
            </div>
        </div>
    </div>
    `;
    
    // ประวัติศาสตร์และข้อมูลเพิ่มเติม (รวมกับแหล่งกำเนิด)
    let historyContent = '';
    if (stone.shistory) {
        historyContent += `<div class="info-box"><strong>ประวัติศาสตร์:</strong> ${stone.shistory}</div>`;
    }
    if (stone.scareful) {
        historyContent += `<div class="info-box"><strong>ข้อควรระวัง:</strong> ${stone.scareful}</div>`;
    }
    if (stone.sborn) {
        historyContent += `<div class="info-box"><strong>แหล่งค้นพบ:</strong> ${stone.sborn}</div>`;
    }
    if (stone.snowmake) {
        historyContent += `<div class="info-box"><strong>แหล่งผลิตปัจจุบัน:</strong> ${stone.snowmake}</div>`;
    }
    if (stone.sobserv) {
        historyContent += `<div class="info-box"><strong>การสังเกต (แท้ vs ปลอม):</strong> ${stone.sobserv}</div>`;
    }
    if (historyContent) {
        htmlContent += `
        <div class="detail-section">
            <h4>🏛️ ประวัติและข้อมูลเพิ่มเติม</h4>
            ${historyContent}
        </div>
        `;
    }
    
    // ข้อมูลทางกายภาพ
    htmlContent += `
    <div class="detail-section">
        <h4>💎 ข้อมูลทางกายภาพ</h4>
        <div class="compact-info">
            <div class="info-row">
                <span class="info-label">ความแข็ง:</span>
                <span class="info-value">${getHardnessName(stone.shardness)}</span>
            </div>
            <div class="info-row">
                <span class="info-label">สี:</span>
                <span class="info-value">${getColorNames(stone.colors)}</span>
            </div>
            <div class="info-row">
                <span class="info-label">ความหายาก:</span>
                <span class="info-value">${getRarityName(stone.rarity)}</span>
            </div>
            <div class="info-row">
                <span class="info-label">ช่วงราคา:</span>
                <span class="info-value">${getPriceRangeName(stone.price_range)}</span>
            </div>
        </div>
    </div>
    `;
    
    htmlContent += `</div>`; // จบคอลัมน์ซ้าย
    
    // คอลัมน์ขวา
    htmlContent += `<div class="detail-column">`;
    
    // ข้อมูลเชิงจิตวิญญาณ
    htmlContent += `
    <div class="detail-section">
        <h4>✨ ข้อมูลเชิงจิตวิญญาณ</h4>
        <div class="compact-info">
            <div class="info-row">
                <span class="info-label">ระดับพลัง:</span>
                <span class="info-value">${getPowerName(stone.spower)}</span>
            </div>
            <div class="info-row">
                <span class="info-label">จักระ:</span>
                <span class="info-value">${getChakraNames(stone.chakra)}</span>
            </div>
            <div class="info-row">
                <span class="info-label">ธาตุ:</span>
                <span class="info-value">${getElementName(stone.element_id)}</span>
            </div>
            <div class="info-row">
                <span class="info-label">เลขศาสตร์:</span>
                <span class="info-value">${getNumerologyName(stone.numerology)}</span>
            </div>
        </div>
    </div>
    `;
    
    // รายละเอียดและวิธีการใช้งาน (รวมเข้าด้วยกัน)
    let usageContent = '';
    const usageDetails = getUsageDetails(stone.stone_usage);
    const cleansingDetails = getCleansingDetails(stone.stone_cleansing);
    
    if (usageDetails) {
        usageContent += `<div class="detail-section"><h5>วิธีการใช้งาน:</h5>${usageDetails}</div>`;
    }
    if (cleansingDetails) {
        usageContent += `<div class="detail-section"><h5>วิธีการทำความสะอาด:</h5>${cleansingDetails}</div>`;
    }
    if (usageContent) {
        htmlContent += `
        <div class="detail-section">
            <h4>🎯 รายละเอียดและวิธีการใช้งาน</h4>
            ${usageContent}
        </div>
        `;
    }
    
    htmlContent += `</div>`; // จบคอลัมน์ขวา
    htmlContent += `</div>`; // จบกริด 2 คอลัมน์
    
    modalBody.innerHTML = htmlContent;
    document.getElementById('stoneModal').style.display = 'block';
}

// ปิด Modal
function closeModal() {
    document.getElementById('stoneModal').style.display = 'none';
}

// ค้นหาภาพสร้อยข้อมือหินบน Google
window.searchGoogleImages = function(stoneName, stoneNameTh) {
    const searchQuery = `สร้อยข้อมือหินมงคล ${stoneNameTh || stoneName}`;
    const url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&tbm=isch`;
    window.open(url, '_blank');
}

// ค้นหาสร้อยข้อมือหินบน Etsy
window.searchEtsy = function(stoneName) {
    const searchQuery = `${stoneName} bracelet`;
    const url = `https://www.etsy.com/search?q=${encodeURIComponent(searchQuery)}`;
    window.open(url, '_blank');
}

// ส่งออกข้อมูลเป็น Text
window.exportToText = function(stoneId) {
    const stone = stonesData.find(s => s.id === stoneId);
    if (!stone) return;
    
    let content = `====================================\n`;
    content += `${stone.english_name.toUpperCase()} (${stone.thai_name})\n`;
    if (stone.other_name) content += `ชื่ออื่น: ${stone.other_name}\n`;
    content += `====================================\n\n`;
    
    if (stone.description) {
        content += `📖 คำอธิบาย:\n${stone.description}\n\n`;
    }
    
    // วัน
    const dayNames = getDayNames(stone.days);
    if (dayNames) content += `📅 วันมงคล: ${dayNames}\n`;
    
    // เดือน
    const monthNames = getMonthNames(stone.months);
    if (monthNames) content += `📅 เดือนมงคล: ${monthNames}\n`;
    
    // ปีนักษัตร
    const zodiacsTh = getZodiacThNames(stone.tzodiacs);
    if (zodiacsTh) content += `🐉 ปีนักษัตร: ${zodiacsTh}\n`;
    
    // ราศี
    const zodiacsEn = getZodiacEnNames(stone.ezodiacs);
    if (zodiacsEn) content += `♈ ราศี: ${zodiacsEn}\n`;
    
    // เลขศาสตร์
    const numNames = getNumerologyNames(stone.numerology);
    if (numNames) content += `🔢 เลขศาสตร์: ${numNames}\n`;
    
    // หมวดหมู่
    const groupNames = getGroupNames(stone.groups);
    if (groupNames) content += `🏷️ หมวดหมู่: ${groupNames}\n`;
    
    // สี
    const colorNames = getColorNames(stone.colors);
    if (colorNames) content += `🎨 สี: ${colorNames}\n`;
    
    // จักระ
    const chakraNames = getChakraNames(stone.chakra);
    if (chakraNames) content += `🧘 จักระ: ${chakraNames}\n`;
    
    // ธาตุ
    const elementName = getElementName(stone.element_id);
    if (elementName && elementName !== '-') content += `🌟 ธาตุ: ${elementName}\n`;
    
    content += `\n`;
    
    // พลังหิน
    const powerName = getPowerName(stone.spower);
    if (powerName && powerName !== '-') content += `✨ พลังหิน: ${powerName}\n`;
    
    // ความแข็ง
    const hardnessName = getHardnessName(stone.shardness);
    if (hardnessName && hardnessName !== '-') content += `💎 ความแข็ง: ${hardnessName}\n`;
    
    // ความหายาก
    const rarityName = getRarityName(stone.rarity);
    if (rarityName && rarityName !== '-') content += `⭐ ความหายาก: ${rarityName}\n`;
    
    // ราคา
    const priceName = getPriceRangeName(stone.price_range);
    if (priceName && priceName !== '-') content += `💰 ราคา: ${priceName}\n`;
    
    if (stone.shistory) content += `\n📜 ประวัติ:\n${stone.shistory}\n`;
    if (stone.sborn) content += `\n🌍 แหล่งกำเนิด:\n${stone.sborn}\n`;
    if (stone.snowmake) content += `\n🏭 แหล่งผลิต:\n${stone.snowmake}\n`;
    if (stone.sobserv) content += `\n🔍 การสังเกต:\n${stone.sobserv}\n`;
    if (stone.scareful) content += `\n⚠️ ข้อควรระวัง:\n${stone.scareful}\n`;
    
    // วิธีการใช้งาน
    const usageDetails = getUsageDetails(stone.stone_usage);
    if (usageDetails) {
        content += `\n💡 วิธีการใช้งาน:\n`;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = usageDetails;
        const usageText = tempDiv.innerText;
        content += usageText + '\n';
    }
    
    // วิธีการทำความสะอาด
    const cleansingDetails = getCleansingDetails(stone.stone_cleansing);
    if (cleansingDetails) {
        content += `\n🧼 วิธีการทำความสะอาด:\n`;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = cleansingDetails;
        const cleansingText = tempDiv.innerText;
        content += cleansingText + '\n';
    }
    
    // สร้างไฟล์ดาวน์โหลด
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${stone.thai_name}_${stone.english_name}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ส่งออกข้อมูลเป็น PDF
window.exportToPDF = function(stoneId) {
    const stone = stonesData.find(s => s.id === stoneId);
    if (!stone) {
        alert('ไม่พบข้อมูลหิน');
        return;
    }
    
    // สร้างหน้า HTML สำหรับพิมพ์
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert('โปรดอนุญาตให้เปิด popup ใหม่');
        return;
    }
    
    const dayNames = getDayNames(stone.days) || '';
    const monthNames = getMonthNames(stone.months) || '';
    const zodiacTh = getZodiacThNames(stone.tzodiacs) || '';
    const zodiacEn = getZodiacEnNames(stone.ezodiacs) || '';
    const numerology = getNumerologyNames(stone.numerology) || '';
    const groups = getGroupNames(stone.groups) || '';
    const colors = getColorNames(stone.colors) || '';
    const chakra = getChakraNames(stone.chakra) || '';
    const element = getElementName(stone.element_id);
    const power = getPowerName(stone.spower);
    const hardness = getHardnessName(stone.shardness);
    const rarity = getRarityName(stone.rarity);
    const price = getPriceRangeName(stone.price_range);
    
    let html = '<!DOCTYPE html><html lang="th"><head>';
    html += '<meta charset="UTF-8">';
    html += '<title>' + stone.thai_name + ' - ' + stone.english_name + '</title>';
    html += '<style>';
    html += 'body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }';
    html += 'h1 { color: #667eea; border-bottom: 3px solid #667eea; padding-bottom: 10px; }';
    html += 'h2 { color: #764ba2; margin-top: 20px; }';
    html += '.section { margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 8px; }';
    html += '.info-row { display: grid; grid-template-columns: 150px 1fr; gap: 10px; margin: 5px 0; }';
    html += '.label { font-weight: bold; color: #667eea; }';
    html += '</style></head><body>';
    
    html += '<h1>' + stone.english_name.toUpperCase() + ' (' + stone.thai_name + ')</h1>';
    if (stone.other_name) {
        html += '<p><em>ชื่ออื่น: ' + stone.other_name + '</em></p>';
    }
    
    if (stone.description) {
        html += '<div class="section"><h2>📖 คำอธิบาย</h2><p>' + stone.description + '</p></div>';
    }
    
    html += '<div class="section"><h2>📅 ข้อมูลทางโหราศาสตร์</h2>';
    if (dayNames) html += '<div class="info-row"><span class="label">วันมงคล:</span><span>' + dayNames + '</span></div>';
    if (monthNames) html += '<div class="info-row"><span class="label">เดือนมงคล:</span><span>' + monthNames + '</span></div>';
    if (zodiacTh) html += '<div class="info-row"><span class="label">ปีนักษัตร:</span><span>' + zodiacTh + '</span></div>';
    if (zodiacEn) html += '<div class="info-row"><span class="label">ราศี:</span><span>' + zodiacEn + '</span></div>';
    if (numerology) html += '<div class="info-row"><span class="label">เลขศาสตร์:</span><span>' + numerology + '</span></div>';
    if (groups) html += '<div class="info-row"><span class="label">หมวดหมู่:</span><span>' + groups + '</span></div>';
    html += '</div>';
    
    html += '<div class="section"><h2>💎 คุณสมบัติหิน</h2>';
    if (colors) html += '<div class="info-row"><span class="label">สี:</span><span>' + colors + '</span></div>';
    if (chakra) html += '<div class="info-row"><span class="label">จักระ:</span><span>' + chakra + '</span></div>';
    if (element && element !== '-') html += '<div class="info-row"><span class="label">ธาตุ:</span><span>' + element + '</span></div>';
    if (power && power !== '-') html += '<div class="info-row"><span class="label">พลังหิน:</span><span>' + power + '</span></div>';
    if (hardness && hardness !== '-') html += '<div class="info-row"><span class="label">ความแข็ง:</span><span>' + hardness + '</span></div>';
    if (rarity && rarity !== '-') html += '<div class="info-row"><span class="label">ความหายาก:</span><span>' + rarity + '</span></div>';
    if (price && price !== '-') html += '<div class="info-row"><span class="label">ราคา:</span><span>' + price + '</span></div>';
    html += '</div>';
    
    if (stone.shistory) {
        html += '<div class="section"><h2>📜 ประวัติ</h2><p>' + stone.shistory + '</p></div>';
    }
    if (stone.sborn) {
        html += '<div class="section"><h2>🌍 แหล่งกำเนิด</h2><p>' + stone.sborn + '</p></div>';
    }
    if (stone.snowmake) {
        html += '<div class="section"><h2>🏭 แหล่งผลิต</h2><p>' + stone.snowmake + '</p></div>';
    }
    if (stone.sobserv) {
        html += '<div class="section"><h2>🔍 การสังเกต</h2><p>' + stone.sobserv + '</p></div>';
    }
    if (stone.scareful) {
        html += '<div class="section"><h2>⚠️ ข้อควรระวัง</h2><p>' + stone.scareful + '</p></div>';
    }
    
    // วิธีการใช้งาน
    const usageDetails = getUsageDetails(stone.stone_usage);
    if (usageDetails) {
        html += '<div class="section"><h2>💡 วิธีการใช้งาน</h2>' + usageDetails + '</div>';
    }
    
    // วิธีการทำความสะอาด
    const cleansingDetails = getCleansingDetails(stone.stone_cleansing);
    if (cleansingDetails) {
        html += '<div class="section"><h2>🧼 วิธีการทำความสะอาด</h2>' + cleansingDetails + '</div>';
    }
    
    html += '<script>window.onload = function() { window.print(); }</script>';
    html += '</body></html>';
    
    printWindow.document.write(html);
    printWindow.document.close();
}

// สลับโหมดระหว่างตัวกรองและวันเกิด
function toggleMode() {
    const filterMode = document.getElementById('filterMode');
    const birthdayMode = document.getElementById('birthdayMode');
    const panelTitle = document.getElementById('panelTitle');
    const toggleBtn = document.getElementById('toggleBtn');
    
    if (filterMode.style.display === 'none') {
        // สลับเป็นโหมดตัวกรอง
        filterMode.style.display = 'block';
        birthdayMode.style.display = 'none';
        panelTitle.textContent = '🔍 ตัวกรอง';
        toggleBtn.textContent = '🎂 วันเกิด';
    } else {
        // สลับเป็นโหมดวันเกิด
        filterMode.style.display = 'none';
        birthdayMode.style.display = 'block';
        panelTitle.textContent = '🎂 ค้นหาหินมงคลวันเกิด';
        toggleBtn.textContent = '🔍 ตัวกรอง';
    }
    
    // ล้างผลการค้นหา
    document.getElementById('results').innerHTML = '<div class="empty-state"><p>กรุณากดปุ่ม "ค้นหา" เพื่อแสดงผลลัพธ์</p></div>';
    document.getElementById('resultCount').textContent = '0';
    document.getElementById('dayInfo').innerHTML = '';
}

// คำนวณวันในสัปดาห์จาก วันเดือนปี
function getDayOfWeek(day, month, year) {
    // แปลง พ.ศ. เป็น ค.ศ.
    const gregorianYear = year - 543;
    const date = new Date(gregorianYear, month - 1, day);
    return date.getDay(); // 0=อาทิตย์, 1=จันทร์, ..., 6=เสาร์
}

// คำนวณปีนักษัตร
function getChineseZodiac(buddhistYear) {
    // สูตร: (พ.ศ. - 18) % 12
    const zodiacIndex = (buddhistYear - 18) % 12;
    return zodiacIndex === 0 ? 12 : zodiacIndex;
}

// คำนวณราศี
function getWesternZodiac(day, month) {
    for (let id in lookupData.ezodiacs) {
        const zodiac = lookupData.ezodiacs[id];
        const start = zodiac.start_month * 100 + zodiac.start_day;
        const end = zodiac.end_month * 100 + zodiac.end_day;
        const current = month * 100 + day;
        
        if (start <= end) {
            // ราศีอยู่ในปีเดียวกัน
            if (current >= start && current <= end) {
                return parseInt(id);
            }
        } else {
            // ราศีข้ามปี (เช่น ธนู-มังกร)
            if (current >= start || current <= end) {
                return parseInt(id);
            }
        }
    }
    return null;
}

// ค้นหาหินจากวันเกิด
function searchByBirthday() {
    const day = parseInt(document.getElementById('birthDay').value);
    const month = parseInt(document.getElementById('birthMonth').value);
    const year = parseInt(document.getElementById('birthYear').value);
    
    if (!day || !month || !year) {
        alert('กรุณากรอกวันเดือนปีเกิดให้ครบถ้วน');
        return;
    }
    
    // คำนวณข้อมูล
    const dayOfWeek = getDayOfWeek(day, month, year);
    const chineseZodiacId = getChineseZodiac(year);
    const westernZodiacId = getWesternZodiac(day, month);
    
    // แปลงวัน (0-6) เป็น ID ใน lookup_days
    // อาทิตย์=1, จันทร์=2, ..., เสาร์=8
    // แต่ถ้าเป็นพุธ (3) จะมี 2 กรณี: พุธกลางวัน=4, พุธกลางคืน=5
    let dayIds = [];
    if (dayOfWeek === 0) dayIds = [1]; // อาทิตย์
    else if (dayOfWeek === 1) dayIds = [2]; // จันทร์
    else if (dayOfWeek === 2) dayIds = [3]; // อังคาร
    else if (dayOfWeek === 3) dayIds = [4, 5]; // พุธ (ทั้ง 2 กรณี)
    else if (dayOfWeek === 4) dayIds = [6]; // พฤหัสบดี
    else if (dayOfWeek === 5) dayIds = [7]; // ศุกร์
    else if (dayOfWeek === 6) dayIds = [8]; // เสาร์
    
    displayBirthdayResults(day, month, year, dayIds, chineseZodiacId, westernZodiacId);
}

// แสดงผลการค้นหาจากวันเกิด
function displayBirthdayResults(day, month, year, dayIds, chineseZodiacId, westernZodiacId) {
    const resultsDiv = document.getElementById('results');
    const resultCount = document.getElementById('resultCount');
    const dayInfoDiv = document.getElementById('dayInfo');
    
    const monthNames = ['', 'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 
                        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    const chineseZodiac = lookupData.tzodiacs[chineseZodiacId];
    const westernZodiac = lookupData.ezodiacs[westernZodiacId];
    
    // แสดงข้อมูลวันเกิด
    let birthdayInfo = `
        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #667eea;">
            <h3 style="color: #667eea; margin: 0 0 10px 0; font-size: 1.1em;">🎂 วันเกิด: ${day} ${monthNames[month]} ${year}</h3>
            <p style="margin: 5px 0; color: #333;">
                <strong>ปีนักษัตร:</strong> ${chineseZodiac ? (chineseZodiac.name || chineseZodiac.name_th) : '-'} | 
                <strong>ราศี:</strong> ${westernZodiac ? westernZodiac.name_th : '-'}
            </p>
        </div>
    `;
    
    let allResults = [];
    let htmlContent = '';
    
    // วนลูปแสดงผลแต่ละวัน (กรณีพุธจะมี 2 ส่วน)
    dayIds.forEach(dayId => {
        const dayInfo = lookupData.days[dayId];
        if (!dayInfo) return;
        
        // กรองหินตามเงื่อนไข
        const results = stonesData.filter(stone => {
            // ตรวจสอบวัน
            const stoneDays = (stone.days || '').toString().split(' ').filter(d => d);
            if (!stoneDays.includes(dayId.toString())) return false;
            
            // ตรวจสอบเดือน
            const stoneMonths = (stone.months || '').toString().split(' ').filter(m => m);
            if (!stoneMonths.includes(month.toString())) return false;
            
            // ตรวจสอบปีนักษัตร
            const stoneZodiacsTh = (stone.tzodiacs || '').toString().split(' ').filter(z => z);
            if (!stoneZodiacsTh.includes(chineseZodiacId.toString())) return false;
            
            // ตรวจสอบราศี
            const stoneZodiacsEn = (stone.ezodiacs || '').toString().split(' ').filter(z => z);
            if (!stoneZodiacsEn.includes(westernZodiacId.toString())) return false;
            
            // ตรวจสอบสีมงคล
            if (dayInfo.lucky_color) {
                const luckyColors = dayInfo.lucky_color.split(',').map(c => c.trim());
                const stoneColorIds = (stone.colors || '').toString().split(' ').filter(c => c);
                const stoneColorNames = stoneColorIds.map(id => {
                    const color = lookupData.colors[parseInt(id)];
                    return color ? color.name_th : '';
                }).filter(n => n);
                
                const hasLuckyColor = luckyColors.some(luckyColor => 
                    stoneColorNames.some(stoneColor => 
                        stoneColor.includes(luckyColor) || luckyColor.includes(stoneColor)
                    )
                );
                
                if (!hasLuckyColor) return false;
            }
            
            return true;
        });
        
        allResults = allResults.concat(results);
        
        // สร้าง HTML แสดงผลแต่ละส่วน
        const icon = dayId === 4 ? '📅' : '🌙';
        htmlContent += `
            <div style="margin-bottom: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 12px; border-radius: 6px; margin-bottom: 10px;">
                    <h4 style="color: white; margin: 0; font-size: 1em;">${icon} ${dayInfo.name}</h4>
                    <p style="color: white; margin: 5px 0 0 0; font-size: 0.9em;">
                        <span style="color: #a7f3d0;">✨ สีมงคล: ${dayInfo.lucky_color}</span> | 
                        <span style="color: #fca5a5;">⚠️ สีอัปมงคล: ${dayInfo.unlucky_color}</span>
                    </p>
                </div>
                <div class="stones-grid">
                    ${results.length > 0 ? results.map(stone => `
                        <div class="stone-card" data-stone-id="${stone.id}">
                            <div class="stone-detail" style="cursor: pointer;">
                                <div class="stone-name">${stone.english_name}</div>
                                <div class="stone-thai">${stone.thai_name}</div>
                            </div>
                            <div class="card-actions">
                                <button type="button" class="search-btn google" data-action="google" data-name="${stone.english_name}" data-name-th="${stone.thai_name}" title="ค้นหาภาพใน Google">G</button>
                                <button type="button" class="search-btn etsy" data-action="etsy" data-name="${stone.english_name}" title="ค้นหาใน Etsy">E</button>
                            </div>
                        </div>
                    `).join('') : '<div class="empty-state"><p>ไม่พบหินที่ตรงเงื่อนไข</p></div>'}
                </div>
            </div>
        `;
    });
    
    dayInfoDiv.innerHTML = birthdayInfo;
    resultsDiv.innerHTML = htmlContent;
    resultCount.textContent = allResults.length;
    
    // เพิ่ม event listeners สำหรับ birthday mode
    document.querySelectorAll('.stone-card').forEach(card => {
        const detailDiv = card.querySelector('.stone-detail');
        const stoneId = parseInt(card.getAttribute('data-stone-id'));
        
        detailDiv.addEventListener('click', function() {
            console.log('Birthday card clicked, stone ID:', stoneId);
            showStoneDetail(stoneId);
        });
    });
    
    document.querySelectorAll('.search-btn.google').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const name = this.getAttribute('data-name');
            const nameTh = this.getAttribute('data-name-th');
            window.searchGoogleImages(name, nameTh);
        });
    });
    
    document.querySelectorAll('.search-btn.etsy').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const name = this.getAttribute('data-name');
            window.searchEtsy(name);
        });
    });
}

// รีเซ็ตตัวกรองเฉพาะฟิลด์
function resetFilter(filterId) {
    const element = document.getElementById(filterId);
    if (element) {
        element.value = '';
    }
}

// รีเซ็ตตัวกรอง
function resetFilters() {
    // รีเซ็ตตัวกรอง
    document.getElementById('stoneName').value = '';
    document.getElementById('stoneColor').value = '';
    document.getElementById('stoneDay').value = '';
    document.getElementById('stoneMonth').value = '';
    document.getElementById('stoneZodiacTh').value = '';
    document.getElementById('stoneZodiacEn').value = '';
    document.getElementById('stoneChakra').value = '';
    document.getElementById('stoneGroup').value = '';
    document.getElementById('stoneHardness').value = '';
    document.getElementById('stonePower').value = '';
    
    // รีเซ็ตวันเกิด
    document.getElementById('birthDay').value = '';
    document.getElementById('birthMonth').value = '';
    document.getElementById('birthYear').value = '';
    selectedDate = { day: null, month: null, year: null };
    
    document.getElementById('results').innerHTML = '<div class="empty-state"><p>กรุณากดปุ่ม "ค้นหา" เพื่อแสดงผลลัพธ์</p></div>';
    document.getElementById('resultCount').textContent = '0';
    document.getElementById('dayInfo').innerHTML = '';
}

// ปิด Modal เมื่อคลิกนอก
window.onclick = function(event) {
    const modal = document.getElementById('stoneModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
    
    // ปิดปฏิทินเมื่อคลิกนอก
    const calendar = document.getElementById('thaiCalendar');
    const calendarBtn = event.target.closest('.calendar-btn');
    const calendarElement = event.target.closest('.thai-calendar');
    
    if (!calendarBtn && !calendarElement && calendar) {
        calendar.classList.remove('show');
    }
}

// Thai Calendar Functions
let currentCalendarMonth = new Date().getMonth() + 1;
let currentCalendarYear = new Date().getFullYear() + 543;
let selectedDate = { day: null, month: null, year: null };

const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

function toggleCalendar() {
    const calendar = document.getElementById('thaiCalendar');
    calendar.classList.toggle('show');
    if (calendar.classList.contains('show')) {
        // ตั้งค่าเริ่มต้นจากค่าที่กรอกไว้ หรือใช้วันที่ปัจจุบัน
        const birthDay = document.getElementById('birthDay').value;
        const birthMonth = document.getElementById('birthMonth').value;
        const birthYear = document.getElementById('birthYear').value;
        
        if (birthYear) {
            currentCalendarYear = parseInt(birthYear);
        } else {
            currentCalendarYear = new Date().getFullYear() + 543;
        }
        
        if (birthMonth) {
            currentCalendarMonth = parseInt(birthMonth);
        } else {
            currentCalendarMonth = new Date().getMonth() + 1;
        }
        
        renderCalendar();
    }
}

function changeMonth(direction) {
    currentCalendarMonth += direction;
    if (currentCalendarMonth > 12) {
        currentCalendarMonth = 1;
        currentCalendarYear++;
    } else if (currentCalendarMonth < 1) {
        currentCalendarMonth = 12;
        currentCalendarYear--;
    }
    renderCalendar();
}

function updateCalendar() {
    currentCalendarMonth = parseInt(document.getElementById('calendarMonthSelect').value);
    currentCalendarYear = parseInt(document.getElementById('calendarYearInput').value);
    renderCalendar();
}

function renderCalendar() {
    const monthSelect = document.getElementById('calendarMonthSelect');
    const yearInput = document.getElementById('calendarYearInput');
    const daysContainer = document.getElementById('calendarDays');
    
    // อัพเดท select และ input
    monthSelect.value = currentCalendarMonth;
    yearInput.value = currentCalendarYear;
    
    // คำนวณวันแรกของเดือน
    const gregorianYear = currentCalendarYear - 543;
    const firstDay = new Date(gregorianYear, currentCalendarMonth - 1, 1).getDay();
    const daysInMonth = new Date(gregorianYear, currentCalendarMonth, 0).getDate();
    const daysInPrevMonth = new Date(gregorianYear, currentCalendarMonth - 1, 0).getDate();
    
    // วันนี้
    const today = new Date();
    const todayDay = today.getDate();
    const todayMonth = today.getMonth() + 1;
    const todayYear = today.getFullYear() + 543;
    
    daysContainer.innerHTML = '';
    
    // วันของเดือนก่อนหน้า
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day other-month';
        dayDiv.textContent = day;
        daysContainer.appendChild(dayDiv);
    }
    
    // วันของเดือนปัจจุบัน
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        dayDiv.textContent = day;
        
        // ตรวจสอบว่าเป็นวันที่เลือกหรือไม่
        if (selectedDate.day === day && 
            selectedDate.month === currentCalendarMonth && 
            selectedDate.year === currentCalendarYear) {
            dayDiv.classList.add('selected');
        }
        
        // ตรวจสอบว่าเป็นวันนี้หรือไม่
        if (day === todayDay && 
            currentCalendarMonth === todayMonth && 
            currentCalendarYear === todayYear) {
            dayDiv.classList.add('today');
        }
        
        dayDiv.onclick = () => selectDate(day, currentCalendarMonth, currentCalendarYear);
        daysContainer.appendChild(dayDiv);
    }
    
    // วันของเดือนถัดไป
    const totalCells = daysContainer.children.length;
    const remainingCells = 42 - totalCells; // 6 rows × 7 days
    for (let i = 1; i <= remainingCells; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day other-month';
        dayDiv.textContent = i;
        daysContainer.appendChild(dayDiv);
    }
}

function selectDate(day, month, year) {
    selectedDate = { day, month, year };
    
    // อัพเดท inputs
    document.getElementById('birthDay').value = day;
    document.getElementById('birthMonth').value = month;
    document.getElementById('birthYear').value = year;
    
    // ปิดปฏิทิน
    document.getElementById('thaiCalendar').classList.remove('show');
    
    // รีเรนเดอร์ปฏิทินเพื่ออัพเดทวันที่เลือก
    renderCalendar();
}

