Add-Type -AssemblyName Microsoft.Office.Interop.Excel

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$workbook = $excel.Workbooks.Open("$(Get-Location)\stones_data.xlsx")
$worksheet = $workbook.Sheets.Item(1)

# ค้นหาคอลัมน์
$shardness_col = 11
$spower_col = 12
$stone_col = 2  # english_name

Write-Host "=== ROWS WITH MISSING OR ZERO VALUES ===" -ForegroundColor Yellow

$total_rows = 0
$missing_hardness = 0
$missing_power = 0
$zero_hardness = 0
$zero_power = 0

for ($row = 2; $row -le 5000; $row++) {
    $stone = $worksheet.Cells.Item($row, $stone_col).Value2
    
    if (-not $stone) {
        break
    }
    
    $total_rows++
    $hardness = $worksheet.Cells.Item($row, $shardness_col).Value2
    $power = $worksheet.Cells.Item($row, $spower_col).Value2
    
    if ($hardness -eq $null -or $hardness -eq '') {
        $missing_hardness++
        if ($missing_hardness -le 20) {
            Write-Host "Row $row : $stone | Hardness: MISSING | Power: $power"
        }
    }
    
    if ($hardness -eq 0) {
        $zero_hardness++
        if ($zero_hardness -le 5) {
            Write-Host "Row $row : $stone | Hardness: 0 (ZERO) | Power: $power"
        }
    }
    
    if ($power -eq $null -or $power -eq '') {
        $missing_power++
        if ($missing_power -le 20) {
            Write-Host "Row $row : $stone | Hardness: $hardness | Power: MISSING"
        }
    }
    
    if ($power -eq 0) {
        $zero_power++
        if ($zero_power -le 5) {
            Write-Host "Row $row : $stone | Hardness: $hardness | Power: 0 (ZERO)"
        }
    }
}

Write-Host "`n=== SUMMARY ===" -ForegroundColor Green
Write-Host "Total rows: $total_rows"
Write-Host "Missing HARDNESS: $missing_hardness"
Write-Host "Missing POWER: $missing_power"
Write-Host "ZERO HARDNESS: $zero_hardness"
Write-Host "ZERO POWER: $zero_power"

$workbook.Close()
$excel.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel)
