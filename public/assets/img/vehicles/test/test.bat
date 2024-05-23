@echo off
setlocal enabledelayedexpansion

:: Set the path to the directory containing the files
set "DIRECTORY=C:\Users\koosh\webWork\TripleM\\assets\img\vehicles"

:: Change to the specified directory
cd /d !DIRECTORY!

:: Loop through each file in the directory
for %%f in (*.*) do (
    :: Extract the file name without extension
    set "FILENAME=%%~nf"
    
    :: Create a directory named after the file (without extension)
    if not exist "!FILENAME!" mkdir "!FILENAME!"
    
    :: Move the file into the newly created directory
    move "%%f" "!FILENAME!\"
)

echo Process completed.
pause
