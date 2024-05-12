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
('Ford', 'F150', 2018, 27000, 'VIN12347', '2.7L V6 turbo', 'Automatic', '4WD', 30000, 'Blue', 'Cloth Beige', '21mpg', '25,18', 'Regular oil changes'),
('Honda', 'Civic', 2021, 20000, 'VIN12348', '2.0L I4', 'CVT', 'FWD', 10000, 'Red', 'Leather White', '32mpg', '36,28', 'Single owner'),
('Hyundai', 'Tucson', 2019, 23000, 'VIN12349', '2.0L I4', 'Automatic', 'AWD', 25000, 'White', 'Cloth Black', '25mpg', '28,22', 'Few scratches'),
('Jeep', 'Wrangler', 2017, 32000, 'VIN12350', '3.6L V6', 'Manual', '4WD', 45000, 'Green', 'Cloth Green', '19mpg', '22,17', 'Custom modifications'),
('Kia', 'Sorento', 2020, 25000, 'VIN12351', '3.3L V6', 'Automatic', 'AWD', 20000, 'Black', 'Leather Beige', '24mpg', '27,21', 'Includes warranty'),
('Lexus', 'RX350', 2021, 44000, 'VIN12352', '3.5L V6', 'Automatic', 'AWD', 15000, 'Grey', 'Leather Grey', '23mpg', '27,20', 'Fully loaded'),
('Mercedes-Benz', 'C-Class', 2018, 33000, 'VIN12353', '2.0L I4 turbo', 'Automatic', 'RWD', 20000, 'White', 'Leather Black', '28mpg', '33,23', 'Minor wear and tear'),
('Nissan', 'Altima', 2019, 18000, 'VIN12354', '2.5L I4', 'CVT', 'FWD', 22000, 'Blue', 'Cloth Blue', '30mpg', '32,23', 'Great condition'),
('Subaru', 'Outback', 2020, 29000, 'VIN12355', '2.5L I4', 'Automatic', 'AWD', 15000, 'Green', 'Cloth Beige', '26mpg', '29,22', 'Excellent condition'),
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
