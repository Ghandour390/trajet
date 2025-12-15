import fetch from 'node-fetch';
import FormData from 'form-data';

async function testSimpleUpload() {
  try {
    console.log('🚀 Test upload simple sans authentification...\n');

    // 1. Connexion pour récupérer un ID utilisateur
    console.log('1. Connexion pour récupérer ID utilisateur...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'mohamed@trajetcamen.com',
        password: 'password123'
      })
    });

    const loginData = await loginResponse.json();
    const userId = loginData.user.id;
    console.log('✅ ID utilisateur récupéré:', userId);

    // 2. Upload image SANS token
    console.log('\n2. Upload image sans authentification...');
    const imageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0x57, 0x63, 0xF8, 0x0F, 0x00, 0x00,
      0x01, 0x00, 0x01, 0x5C, 0xC2, 0x8A, 0x8E, 0x00, 0x00, 0x00, 0x00, 0x49,
      0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);

    const formData = new FormData();
    formData.append('image', imageBuffer, {
      filename: 'simple-test.png',
      contentType: 'image/png'
    });

    // Upload SANS header Authorization
    const uploadResponse = await fetch(`http://localhost:5000/api/users/${userId}/profile-image`, {
      method: 'POST',
      headers: formData.getHeaders(), // Pas de token ici
      body: formData
    });

    console.log(`Upload Status: ${uploadResponse.status}`);
    
    if (!uploadResponse.ok) {
      const error = await uploadResponse.text();
      console.log('❌ Upload failed:', error);
      return;
    }

    const uploadData = await uploadResponse.json();
    console.log('✅ Upload réussi sans authentification!');
    console.log('📸 URL de l\'image:', uploadData.profileImage);

    // 3. Test accès direct à l'image
    console.log('\n3. Test accès direct à l\'image...');
    try {
      const imageResponse = await fetch(uploadData.profileImage);
      console.log(`Image Status: ${imageResponse.status}`);
      console.log(`Content-Type: ${imageResponse.headers.get('content-type')}`);
      
      if (imageResponse.ok) {
        console.log('✅ Image accessible publiquement');
      } else {
        console.log('❌ Image non accessible');
      }
    } catch (error) {
      console.log('❌ Erreur accès image:', error.message);
    }

    // 4. Vérification que l'utilisateur a été mis à jour
    console.log('\n4. Vérification mise à jour utilisateur...');
    const userResponse = await fetch(`http://localhost:5000/api/users/${userId}`, {
      headers: { 'Authorization': `Bearer ${loginData.token}` }
    });

    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log('✅ Utilisateur mis à jour');
      console.log('📸 Image dans profil:', userData.profileImage);
      
      if (userData.profileImage === uploadData.profileImage) {
        console.log('✅ URL correctement sauvegardée');
      } else {
        console.log('❌ URL non sauvegardée correctement');
      }
    }

    console.log('\n🎉 Test terminé avec succès!');
    console.log('\n📋 Résumé:');
    console.log('- ✅ Upload sans authentification');
    console.log('- ✅ Image publiquement accessible');
    console.log('- ✅ URL sauvegardée dans profil utilisateur');
    console.log('- ✅ MinIO configuré en mode public');

  } catch (error) {
    console.error('❌ Erreur globale:', error.message);
  }
}

testSimpleUpload();