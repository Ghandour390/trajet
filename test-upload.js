import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const API_BASE = 'http://localhost:5000/api';

// Test de l'upload d'image de profil
async function testUploadProfileImage() {
  try {
    console.log('🧪 Test de l\'API d\'upload d\'image de profil...\n');

    // 1. Connexion pour obtenir un token
    console.log('1. Connexion...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@trajet.com',
        password: 'admin123'
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`Erreur de connexion: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Connexion réussie');

    // 2. Récupération des utilisateurs pour obtenir un ID
    console.log('\n2. Récupération des utilisateurs...');
    const usersResponse = await fetch(`${API_BASE}/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!usersResponse.ok) {
      throw new Error(`Erreur récupération utilisateurs: ${usersResponse.status}`);
    }

    const users = await usersResponse.json();
    if (users.length === 0) {
      throw new Error('Aucun utilisateur trouvé');
    }

    const userId = users[0]._id;
    console.log(`✅ Utilisateur trouvé: ${userId}`);

    // 3. Création d'une image de test (pixel rouge 1x1)
    console.log('\n3. Création d\'une image de test...');
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0x57, 0x63, 0xF8, 0x0F, 0x00, 0x00,
      0x01, 0x00, 0x01, 0x5C, 0xC2, 0x8A, 0x8E, 0x00, 0x00, 0x00, 0x00, 0x49,
      0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);

    // 4. Test de l'upload
    console.log('\n4. Test de l\'upload d\'image...');
    const formData = new FormData();
    formData.append('image', testImageBuffer, {
      filename: 'test-profile.png',
      contentType: 'image/png'
    });

    const uploadResponse = await fetch(`${API_BASE}/users/${userId}/profile-image`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        ...formData.getHeaders()
      },
      body: formData
    });

    console.log(`Status: ${uploadResponse.status}`);
    
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`Erreur upload: ${uploadResponse.status} - ${errorText}`);
    }

    const uploadData = await uploadResponse.json();
    console.log('✅ Upload réussi!');
    console.log('📸 URL de l\'image:', uploadData.profileImage);

    // 5. Test de connexion à MinIO
    console.log('\n5. Test de connexion MinIO...');
    const minioResponse = await fetch('http://localhost:9000/minio/health/live');
    console.log(`MinIO Status: ${minioResponse.status}`);
    
    if (minioResponse.ok) {
      console.log('✅ MinIO est accessible');
    } else {
      console.log('❌ MinIO n\'est pas accessible');
    }

    // 6. Test d'accès au bucket
    console.log('\n6. Test d\'accès au bucket...');
    try {
      const bucketResponse = await fetch('http://localhost:9000/trajet-documents/');
      console.log(`Bucket Status: ${bucketResponse.status}`);
    } catch (error) {
      console.log('❌ Erreur d\'accès au bucket:', error.message);
    }

    console.log('\n🎉 Test terminé avec succès!');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    
    // Diagnostic supplémentaire
    console.log('\n🔍 Diagnostic:');
    
    // Test de connectivité MinIO
    try {
      const minioTest = await fetch('http://localhost:9000/minio/health/live');
      console.log(`- MinIO accessible: ${minioTest.ok ? '✅' : '❌'}`);
    } catch {
      console.log('- MinIO accessible: ❌');
    }
    
    // Test de connectivité serveur
    try {
      const serverTest = await fetch('http://localhost:5000/api/health');
      console.log(`- Serveur accessible: ${serverTest.ok ? '✅' : '❌'}`);
    } catch {
      console.log('- Serveur accessible: ❌');
    }
  }
}

// Exécution du test
testUploadProfileImage();