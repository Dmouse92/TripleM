# Load the SQLite assembly
Add-Type -Path "C:\path\to\System.Data.SQLite.dll"

# Connection string to your SQLite database
$connectionString = "Data Source=C:\path\to\your\database\vehdatabase.sqlite3;Version=3;"

# Create the connection object
$conn = New-Object System.Data.SQLite.SQLiteConnection($connectionString)

# SQL command to insert data
$sql = @"
INSERT INTO vehDB (make, model, year, price, vin, engine, transmission, drive, mileage, exterior, interior, fuelEconomy, features, comments) VALUES 
('BMW', '3 Series', 2020, 35000, 'VIN12345', '3.0L I6', 'Automatic', 'RWD', 5000, 'Black', 'Leather Black', '28mpg', '30,22', 'Excellent condition'),
('Chevrolet', 'Malibu', 2019, 22000, 'VIN12346', '2.5L I4', 'Automatic', 'FWD', 15000, 'Silver', 'Cloth Gray', '30mpg', '32,24', 'Well maintained'),
...
('Tesla', 'Model 3', 2021, 48000, 'VIN12356', 'Electric', 'Automatic', 'RWD', 12000, 'Red', 'Vegan Leather Black', 'None', '130,120', 'Low mileage, pristine condition');
"@


try {
    # Open the connection
    $conn.Open()

    # Create the command object
    $cmd = New-Object System.Data.SQLite.SQLiteCommand($sql, $conn)

    # Execute the command
    $cmd.ExecuteNonQuery()

    Write-Host "Data inserted successfully"
} catch {
    Write-Host "An error occurred: $_"
} finally {
    # Close the connection
    if ($conn -ne $null) {
        $conn.Close()
    }
}
