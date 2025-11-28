Add-Type -AssemblyName Microsoft.Office.Interop.Excel

# ข้อมูล mapping ที่ถูกต้องตามหินมงคลจริง
# Format: @{StonePattern = @{hardness_id = X, power_id = Y}}

$stone_corrections = @{
    'Tourmaline' = @{'hardness' = 7; 'power' = 4}
    'ทัวร์มาลีน' = @{'hardness' = 7; 'power' = 4}
    'Lapis Lazuli' = @{'hardness' = 5; 'power' = 3}
    'ลาพิส' = @{'hardness' = 5; 'power' = 3}
    'Clear Quartz' = @{'hardness' = 3; 'power' = 9}
    'ควอตซ์ใส' = @{'hardness' = 3; 'power' = 9}
    'Hematite' = @{'hardness' = 5; 'power' = 1}
    'ฮีมาไทต์' = @{'hardness' = 5; 'power' = 1}
    'Amethyst' = @{'hardness' = 3; 'power' = 3}
    'อเมทิสต์' = @{'hardness' = 3; 'power' = 3}
    'Aquamarine' = @{'hardness' = 4; 'power' = 3}
    'อะความารีน' = @{'hardness' = 4; 'power' = 3}
    'Moldavite' = @{'hardness' = 3; 'power' = 8}
    'โมลดาไวต์' = @{'hardness' = 3; 'power' = 8}
    'Phenacite' = @{'hardness' = 4; 'power' = 3}
    'ฟีนาไซต์' = @{'hardness' = 4; 'power' = 3}
    'Fluorite' = @{'hardness' = 1; 'power' = 3}
    'ฟลูออไรต์' = @{'hardness' = 1; 'power' = 3}
    'Topaz' = @{'hardness' = 4; 'power' = 3}
    'โทแพซ' = @{'hardness' = 4; 'power' = 3}
    'Ruby' = @{'hardness' = 10; 'power' = 1}
    'ทับทิม' = @{'hardness' = 10; 'power' = 1}
    'Sapphire' = @{'hardness' = 10; 'power' = 3}
    'แซฟไฟร์' = @{'hardness' = 10; 'power' = 3}
    'Diamond' = @{'hardness' = 11; 'power' = 3}
    'เพชร' = @{'hardness' = 11; 'power' = 3}
    'Emerald' = @{'hardness' = 4; 'power' = 3}
    'มรกต' = @{'hardness' = 4; 'power' = 3}
    'Garnet' = @{'hardness' = 4; 'power' = 1}
    'โกเมน' = @{'hardness' = 4; 'power' = 1}
    'Moonstone' = @{'hardness' = 2; 'power' = 2}
    'มูนสโตน' = @{'hardness' = 2; 'power' = 2}
    'Selenite' = @{'hardness' = 1; 'power' = 3}
    'ซีลีไนต์' = @{'hardness' = 1; 'power' = 3}
    'Obsidian' = @{'hardness' = 3; 'power' = 4}
    'ออบซิเดียน' = @{'hardness' = 3; 'power' = 4}
    'Opal' = @{'hardness' = 2; 'power' = 3}
    'โอปอล' = @{'hardness' = 2; 'power' = 3}
}

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$workbook = $excel.Workbooks.Open("$(Get-Location)\stones_data.xlsx")
$worksheet = $workbook.Sheets.Item(1)

$shardness_col = 11
$spower_col = 12
$stone_col = 2

$corrections_made = 0

Write-Host "=== SCANNING FOR CORRECTIONS ===" -ForegroundColor Green

for ($row = 2; $row -le 5000; $row++) {
    $stone = $worksheet.Cells.Item($row, $stone_col).Value2
    
    if (-not $stone) {
        break
    }
    
    # ตรวจสอบว่าต้องแก้ไขหินตัวนี้หรือไม่
    foreach ($pattern in $stone_corrections.Keys) {
        if ($stone -match $pattern) {
            $current_hardness = $worksheet.Cells.Item($row, $shardness_col).Value2
            $current_power = $worksheet.Cells.Item($row, $spower_col).Value2
            
            $new_hardness = $stone_corrections[$pattern]['hardness']
            $new_power = $stone_corrections[$pattern]['power']
            
            if ($current_hardness -ne $new_hardness -or $current_power -ne $new_power) {
                Write-Host "Row $($row): $($stone)"
                Write-Host "  Hardness: $($current_hardness) -> $($new_hardness)"
                Write-Host "  Power: $($current_power) -> $($new_power)"
                
                $worksheet.Cells.Item($row, $shardness_col) = $new_hardness
                $worksheet.Cells.Item($row, $spower_col) = $new_power
                $corrections_made++
            }
            break
        }
    }
}

Write-Host "`n=== SUMMARY ===" -ForegroundColor Green
Write-Host "Corrections made: $corrections_made"

if ($corrections_made -gt 0) {
    $workbook.Save()
    Write-Host "File saved successfully!" -ForegroundColor Green
}

$workbook.Close()
$excel.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel)
