Add-Type -AssemblyName Microsoft.Office.Interop.Excel

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$workbook = $excel.Workbooks.Open("$(Get-Location)\stones_data.xlsx")
$worksheet = $workbook.Sheets.Item(1)

# ดึง headers
$headers = @()
for ($i = 1; $i -le 25; $i++) {
    $cell = $worksheet.Cells.Item(1, $i)
    if ($cell.Value2) {
        $headers += $cell.Value2
    }
}

Write-Host "Reading Excel data..." -ForegroundColor Green
$stones = @()

for ($row = 2; $row -le 5000; $row++) {
    $stone_name = $worksheet.Cells.Item($row, 2).Value2
    
    if (-not $stone_name) {
        break
    }
    
    $stone = @{}
    
    # สร้าง object สำหรับหินแต่ละตัว
    for ($col = 1; $col -le $headers.Count; $col++) {
        $header = $headers[$col - 1]
        $value = $worksheet.Cells.Item($row, $col).Value2
        
        # แปลงเป็นรูปแบบที่เหมาะสม
        if ($value -eq $null) {
            $value = ""
        } elseif ($value -is [double]) {
            $value = [int]$value
        }
        
        $stone[$header] = $value
    }
    
    $stones += $stone
}

Write-Host "Total stones: $($stones.Count)" -ForegroundColor Green

# บันทึก JSON
$json_path = "stones_data.json"
$stones | ConvertTo-Json | Out-File $json_path -Encoding UTF8

Write-Host "JSON file created: $json_path" -ForegroundColor Green
Write-Host "Size: $(Get-Item $json_path | Select-Object -ExpandProperty Length) bytes"

$workbook.Close()
$excel.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel)
