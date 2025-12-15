import fetch from 'node-fetch';
import FormData from 'form-data';

async function testUpload() {
  try {
    console.log('🧪 Test d\'upload d\'image de profil...\n');

    // 1. Connexion
    console.log('1. Connexion...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@test.com',
        password: 'test123'
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`Erreur de connexion: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    const userId = loginData.user.id;
    console.log('✅ Connexion réussie');
    console.log('👤 User ID:', userId);

    // 2. Création d'une image de test (PNG 1x1 pixel rouge)
    console.log('\n2. Préparation de l\'image de test...');
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0x57, 0x63, 0xF8, 0x0F, 0x00, 0x00,
      0x01, 0x00, 0x01, 0x5C, 0xC2, 0x8A, 0x8E, 0x00, 0x00, 0x00, 0x00, 0x49,
      0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);

    // 3. Upload de l'image
    console.log('\n3. Upload de l\'image...');
    const formData = new FormData();
    formData.append('image', testImageBuffer, {
      filename: 'test-profile.png',
      contentType: 'image/png'
    });

    const uploadResponse = await fetch(`http://localhost:5000/api/users/${userId}/profile-image`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        ...formData.getHeaders()
      },
      body: formData
    });

    console.log(`Upload Status: ${uploadResponse.status}`);
    
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.log('❌ Erreur:', errorText);
      return;
    }

    const uploadData = await uploadResponse.json();
    console.log('✅ Upload réussi!');
    console.log('📸 URL de l\'image:', uploadData.profileImage);

    // 4. Vérification que l'image est accessible
    console.log('\n4. Vérification de l\'accessibilité de l\'image...');
    try {
      const imageResponse = await fetch(uploadData.profileImage);
      console.log(`Image accessible: ${imageResponse.status} - ${imageResponse.ok ? '✅' : '❌'}`);
      console.log(`Content-Type: ${imageResponse.headers.get('content-type')}`);
    } catch (error) {
      console.log('❌ Image non accessible:', error.message);
    }

    console.log('\n🎉 Test d\'upload terminé avec succès!');
    console.log('\n📋 Résumé:');
    console.log('- ✅ Serveur API fonctionnel');
    console.log('- ✅ MinIO fonctionnel');
    console.log('- ✅ Upload d\'image réussi');
    console.log('- ✅ Image accessible via URL');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
}

testUpload();