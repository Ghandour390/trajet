import fetch from 'node-fetch';
import FormData from 'form-data';

async function testMinioImages() {
  try {
    console.log('🧪 Test MinIO Images...\n');

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
    console.log('\n2. Upload image...');
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
      filename: 'test.png',
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
    console.log('📸 URL:', uploadData.profileImage);

    // 3. Test direct access
    console.log('\n3. Test accès direct...');
    const imageUrl = uploadData.profileImage;
    
    try {
      const imageResponse = await fetch(imageUrl);
      console.log(`Status: ${imageResponse.status}`);
      console.log(`Headers:`, Object.fromEntries(imageResponse.headers.entries()));
      
      if (imageResponse.ok) {
        console.log('✅ Image accessible');
      } else {
        console.log('❌ Image non accessible');
        const errorBody = await imageResponse.text();
        console.log('Error body:', errorBody);
      }
    } catch (error) {
      console.log('❌ Erreur fetch:', error.message);
    }

    // 4. Test bucket direct
    console.log('\n4. Test bucket direct...');
    try {
      const bucketResponse = await fetch('http://localhost:9000/trajet-documents/');
      console.log(`Bucket Status: ${bucketResponse.status}`);
      if (!bucketResponse.ok) {
        const bucketError = await bucketResponse.text();
        console.log('Bucket Error:', bucketError);
      }
    } catch (error) {
      console.log('❌ Bucket error:', error.message);
    }

  } catch (error) {
    console.error('❌ Erreur globale:', error.message);
  }
}

testMinioImages();