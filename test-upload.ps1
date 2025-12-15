# Test de l'API d'upload d'image de profil
Write-Host "🧪 Test de l'API d'upload d'image de profil..." -ForegroundColor Cyan

# 1. Test de connexion au serveur
Write-Host "`n1. Test de connectivité serveur..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"test@test.com","password":"test123"}' -ErrorAction Stop
    Write-Host "✅ Connexion réussie" -ForegroundColor Green
    $token = $response.token
    $userId = $response.user.id
    Write-Host "👤 User ID: $userId" -ForegroundColor White
} catch {
    Write-Host "❌ Erreur de connexion: $($_.Exception.Message)" -ForegroundColor Red
    
    # Essayons de créer un utilisateur de test
    Write-Host "`n📝 Création d'un utilisateur de test..." -ForegroundColor Yellow
    try {
        $registerResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -ContentType "application/json" -Body '{"nom":"Test","prenom":"User","email":"test@test.com","password":"test123","role":"chauffeur"}' -ErrorAction Stop
        Write-Host "✅ Utilisateur créé" -ForegroundColor Green
        
        # Nouvelle tentative de connexion
        $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"test@test.com","password":"test123"}' -ErrorAction Stop
        $token = $response.token
        $userId = $response.user.id
        Write-Host "✅ Connexion réussie après création" -ForegroundColor Green
    } catch {
        Write-Host "❌ Impossible de créer l'utilisateur: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

# 2. Test MinIO
Write-Host "`n2. Test MinIO..." -ForegroundColor Yellow
try {
    $minioResponse = Invoke-WebRequest -Uri "http://localhost:9000/minio/health/live" -Method GET -ErrorAction Stop
    Write-Host "✅ MinIO accessible (Status: $($minioResponse.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ MinIO non accessible: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Création d'une image de test
Write-Host "`n3. Création d'une image de test..." -ForegroundColor Yellow
$imageBytes = [System.Convert]::FromBase64String("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==")
$tempImagePath = "$env:TEMP\test-profile.png"
[System.IO.File]::WriteAllBytes($tempImagePath, $imageBytes)
Write-Host "✅ Image de test créée: $tempImagePath" -ForegroundColor Green

# 4. Test d'upload
Write-Host "`n4. Test d'upload d'image..." -ForegroundColor Yellow
try {
    # Préparation du formulaire multipart
    $boundary = [System.Guid]::NewGuid().ToString()
    $LF = "`r`n"
    
    $bodyLines = (
        "--$boundary",
        "Content-Disposition: form-data; name=`"image`"; filename=`"test-profile.png`"",
        "Content-Type: image/png$LF",
        [System.Text.Encoding]::GetEncoding("iso-8859-1").GetString($imageBytes),
        "--$boundary--$LF"
    ) -join $LF
    
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "multipart/form-data; boundary=$boundary"
    }
    
    $uploadResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/users/$userId/profile-image" -Method POST -Headers $headers -Body $bodyLines -ErrorAction Stop
    
    Write-Host "✅ Upload réussi!" -ForegroundColor Green
    Write-Host "📸 URL de l'image: $($uploadResponse.profileImage)" -ForegroundColor White
    
    # 5. Test d'accès à l'image
    Write-Host "`n5. Test d'accès à l'image..." -ForegroundColor Yellow
    try {
        $imageAccessResponse = Invoke-WebRequest -Uri $uploadResponse.profileImage -Method GET -ErrorAction Stop
        Write-Host "✅ Image accessible (Status: $($imageAccessResponse.StatusCode))" -ForegroundColor Green
        Write-Host "📄 Content-Type: $($imageAccessResponse.Headers.'Content-Type')" -ForegroundColor White
    } catch {
        Write-Host "❌ Image non accessible: $($_.Exception.Message)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Erreur d'upload: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "📄 Détails de l'erreur: $responseBody" -ForegroundColor Red
    }
}

# Nettoyage
Remove-Item $tempImagePath -ErrorAction SilentlyContinue

Write-Host "`n🎉 Test terminé!" -ForegroundColor Cyan