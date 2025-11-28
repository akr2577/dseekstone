Add-Type -AssemblyName Microsoft.Office.Interop.Excel

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$workbook = $excel.Workbooks.Open("$(Get-Location)\stones_data.xlsx")
$worksheet = $workbook.Sheets.Item(1)

# ดึง headers
$headers = @()
for ($i = 1; $i -le 30; $i++) {
    $cell = $worksheet.Cells.Item(1, $i)
    if ($cell.Value2) {
        $headers += $cell.Value2
    }
}

Write-Host "=== COLUMN HEADERS ===" -ForegroundColor Green
for ($i = 0; $i -lt $headers.Count; $i++) {
    Write-Host "$($i+1). $($headers[$i])"
}

# ค้นหาคอลัมน์
$shardness_col = 0
$spower_col = 0
$stone_col = 0

for ($i = 0; $i -lt $headers.Count; $i++) {
    if ($headers[$i] -match 'shardness|hardness') {
        $shardness_col = $i + 1
    }
    if ($headers[$i] -match 'spower|power') {
        $spower_col = $i + 1
    }
    if ($headers[$i] -match 'english_name|name') {
        $stone_col = $i + 1
    }
}

Write-Host "`n=== COLUMN POSITIONS ===" -ForegroundColor Green
Write-Host "Stone Name: $stone_col"
Write-Host "Shardness: $shardness_col"
Write-Host "Spower: $spower_col"

# ตรวจสอบข้อมูล
Write-Host "`n=== DATA PREVIEW (First 20 rows) ===" -ForegroundColor Green
for ($row = 2; $row -le 21; $row++) {
    $stone = $worksheet.Cells.Item($row, $stone_col).Value2
    $hardness = $worksheet.Cells.Item($row, $shardness_col).Value2
    $power = $worksheet.Cells.Item($row, $spower_col).Value2
    
    if ($stone) {
        Write-Host "Row $row : $stone | Hardness: $hardness | Power: $power"
    } else {
        break
    }
}

$workbook.Close()
$excel.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel)
