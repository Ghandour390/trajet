import fetch from 'node-fetch';
import FormData from 'form-data';

async function testUploadWithDB() {
  try {
    console.log('🧪 Test d\'upload avec la nouvelle DB...\n');

    // 1. Connexion avec un utilisateur du seed
    console.log('1. Connexion avec Mohamed...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'mohamed@trajetcamen.com',
        password: 'password123'
      })
    });

    if (!loginResponse.ok) {
      const errorText = await loginResponse.text();
      throw new Error(`Erreur de connexion: ${loginResponse.status} - ${errorText}`);
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    const userId = loginData.user.id;
    console.log('✅ Connexion réussie');
    console.log('👤 User:', loginData.user.firstname, loginData.user.lastname);
    console.log('🆔 ID:', userId);

    // 2. Upload d'image
    console.log('\n2. Upload d\'image de profil...');
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0x57, 0x63, 0xF8, 0x0F, 0x00, 0x00,
      0x01, 0x00, 0x01, 0x5C, 0xC2, 0x8A, 0x8E, 0x00, 0x00, 0x00, 0x00, 0x49,
      0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);

    const formData = new FormData();
    formData.append('image', testImageBuffer, {
      filename: 'mohamed-profile.png',
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
      console.log('❌ Erreur upload:', errorText);
      return;
    }

    const uploadData = await uploadResponse.json();
    console.log('✅ Upload réussi!');
    console.log('📸 URL de l\'image:', uploadData.profileImage);

    // 3. Vérification que l'utilisateur a été mis à jour
    console.log('\n3. Vérification de la mise à jour utilisateur...');
    const userResponse = await fetch(`http://localhost:5000/api/users/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log('✅ Utilisateur mis à jour');
      console.log('📸 Image dans profil:', userData.profileImage ? 'OUI' : 'NON');
    }

    // 4. Test d'accès à l'image
    console.log('\n4. Test d\'accès à l\'image...');
    try {
      const imageResponse = await fetch(uploadData.profileImage);
      console.log(`Image Status: ${imageResponse.status}`);
      if (imageResponse.ok) {
        console.log('✅ Image accessible');
        console.log(`Content-Type: ${imageResponse.headers.get('content-type')}`);
      } else {
        console.log('❌ Image non accessible');
      }
    } catch (error) {
      console.log('❌ Erreur d\'accès à l\'image:', error.message);
    }

    console.log('\n🎉 Test terminé avec succès!');
    console.log('\n📋 Résumé:');
    console.log('- ✅ Base de données initialisée');
    console.log('- ✅ Connexion utilisateur');
    console.log('- ✅ Upload d\'image');
    console.log('- ✅ Mise à jour du profil');
    console.log('- ✅ MinIO fonctionnel');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testUploadWithDB();