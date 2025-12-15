@echo off
echo Test de l'API d'upload d'image de profil...

echo.
echo 1. Connexion...
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@test.com\",\"password\":\"test123\"}" ^
  -o login_response.json

echo.
echo 2. Extraction du token...
for /f "tokens=2 delims=:" %%a in ('findstr "token" login_response.json') do set TOKEN_PART=%%a
for /f "tokens=1 delims=," %%a in ("%TOKEN_PART%") do set TOKEN=%%a
set TOKEN=%TOKEN:~2,-1%

echo Token: %TOKEN%

echo.
echo 3. Extraction de l'ID utilisateur...
for /f "tokens=2 delims=:" %%a in ('findstr "\"id\"" login_response.json') do set ID_PART=%%a
for /f "tokens=1 delims=," %%a in ("%ID_PART%") do set USER_ID=%%a
set USER_ID=%USER_ID:~2,-1%

echo User ID: %USER_ID%

echo.
echo 4. Test d'upload d'image...
echo iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg== > temp_image_b64.txt
certutil -decode temp_image_b64.txt test_image.png >nul 2>&1

curl -X POST http://localhost:5000/api/users/%USER_ID%/profile-image ^
  -H "Authorization: Bearer %TOKEN%" ^
  -F "image=@test_image.png" ^
  -v

echo.
echo 5. Test MinIO...
curl -I http://localhost:9000/minio/health/live

echo.
echo Nettoyage...
del login_response.json temp_image_b64.txt test_image.png 2>nul

echo.
echo Test terminé!
pause