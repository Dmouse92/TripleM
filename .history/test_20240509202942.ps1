ou# Define a hashtable that maps old filenames to new filenames
$mapping = @{
    "BMW_3S.png" = "BMW_3_Series_VIN12345_1.JPG"
    "Chevrolet_Malibu.png" = "Chevrolet_Malibu_VIN12346_2.JPG"
    "Ford_F150.png" = "Ford_F150_VIN12347_3.JPG"
    "Honda_Civic.png" = "Honda_Civic_VIN12348_4.JPG"
    "Hyundai_Tucson.png" = "Hyundai_Tucson_VIN12349_5.JPG"
    "Jeep_Wrangler.png" = "Jeep_Wrangler_VIN12350_6.JPG"
    "Kia_Sorento.png" = "Kia_Sorento_VIN12351_7.JPG"
    "Lexus_RX350.png" = "Lexus_RX350_VIN12352_8.JPG"
    "MBenz_CClass.png" = "Mercedes-Benz_C-Class_VIN12353_9.JPG"
    "Nissan_Altima.png" = "Nissan_Altima_VIN12354_10.JPG"
    "Subaru_Outback.png" = "Subaru_Outback_VIN12355_11.JPG"
    "Tesla_Model3.png" = "Tesla_Model_3_VIN12356_12.JPG"
}

# Define the directory containing the files
$directory = "C:\Users\koosh\webWork\TripleM\assets\img\vehicles"

# Iterate over each mapping and rename the files
foreach ($file in Get-ChildItem -Path $directory) {
    if ($mapping.ContainsKey($file.Name)) {
        $newName = $mapping[$file.Name]
        $newPath = Join-Path -Path $directory -ChildPath $newName
        Rename-Item -Path $file.FullName -NewName $newPath
        Write-Host "Renamed $($file.Name) to $newName"
    }
}
