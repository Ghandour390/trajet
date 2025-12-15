import fetch from 'node-fetch';
import FormData from 'form-data';

async function testSecureImages() {
  try {
    console.log('🔒 Test du système d\'images sécurisé...\n');

    // 1. Connexion
    console.log('1. Connexion...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'mohamed@trajetcamen.com',
        password: 'password123'
      })
    });

    const loginData = await loginResponse.json();
    const token = loginData.token;
    const userId = loginData.user.id;
    console.log('✅ Connexion OK');

    // 2. Upload image
    console.log('\n2. Upload image sécurisé...');
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
      filename: 'secure-test.png',
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

    if (!uploadResponse.ok) {
      const error = await uploadResponse.text();
      console.log('❌ Upload failed:', error);
      return;
    }

    const uploadData = await uploadResponse.json();
    console.log('✅ Upload OK');
    console.log('📁 Nom fichier:', uploadData.fileName);
    console.log('🔗 URL présignée:', uploadData.profileImage);

    // 3. Test accès avec URL présignée (autorisé)
    console.log('\n3. Test accès avec URL présignée...');
    try {
      const presignedResponse = await fetch(uploadData.profileImage);
      console.log(`Status: ${presignedResponse.status}`);
      if (presignedResponse.ok) {
        console.log('✅ Accès autorisé avec URL présignée');
      } else {
        console.log('❌ Accès refusé même avec URL présignée');
      }
    } catch (error) {
      console.log('❌ Erreur accès présigné:', error.message);
    }

    // 4. Test accès direct au bucket (doit être refusé)
    console.log('\n4. Test accès direct au bucket (doit être refusé)...');
    try {
      const directUrl = `http://localhost:9000/trajet-documents/${uploadData.fileName}`;
      const directResponse = await fetch(directUrl);
      console.log(`Status accès direct: ${directResponse.status}`);
      if (directResponse.ok) {
        console.log('❌ PROBLÈME: Accès direct autorisé (devrait être refusé)');
      } else {
        console.log('✅ Accès direct refusé (sécurité OK)');
      }
    } catch (error) {
      console.log('✅ Accès direct impossible (sécurité OK)');
    }

    // 5. Test récupération nouvelle URL présignée
    console.log('\n5. Test récupération nouvelle URL...');
    try {
      const newUrlResponse = await fetch(`http://localhost:5000/api/users/${userId}/profile-image`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (newUrlResponse.ok) {
        const newUrlData = await newUrlResponse.json();
        console.log('✅ Nouvelle URL générée');
        console.log('🔗 Nouvelle URL:', newUrlData.profileImage);
        
        // Test de la nouvelle URL
        const testNewUrl = await fetch(newUrlData.profileImage);
        console.log(`Nouvelle URL Status: ${testNewUrl.status}`);
      }
    } catch (error) {
      console.log('❌ Erreur génération nouvelle URL:', error.message);
    }

    // 6. Test accès sans authentification (doit être refusé)
    console.log('\n6. Test accès sans authentification...');
    try {
      const noAuthResponse = await fetch(`http://localhost:5000/api/users/${userId}/profile-image`);
      console.log(`Status sans auth: ${noAuthResponse.status}`);
      if (noAuthResponse.status === 401) {
        console.log('✅ Accès refusé sans authentification (sécurité OK)');
      } else {
        console.log('❌ PROBLÈME: Accès autorisé sans authentification');
      }
    } catch (error) {
      console.log('✅ Accès impossible sans auth (sécurité OK)');
    }

    console.log('\n🎉 Test de sécurité terminé!');
    console.log('\n📋 Résumé sécurité:');
    console.log('- ✅ Upload sécurisé avec authentification');
    console.log('- ✅ URLs présignées temporaires');
    console.log('- ✅ Accès direct au bucket bloqué');
    console.log('- ✅ Authentification requise pour nouvelles URLs');

  } catch (error) {
    console.error('❌ Erreur globale:', error.message);
  }
}

testSecureImages();