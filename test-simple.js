import fetch from 'node-fetch';

async function testAPI() {
  try {
    // Test de base du serveur
    console.log('🧪 Test de l\'API...\n');
    
    // 1. Test de santé du serveur
    console.log('1. Test de connectivité serveur...');
    const healthResponse = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nom: 'Test',
        prenom: 'User',
        email: 'test@test.com',
        password: 'test123',
        role: 'chauffeur'
      })
    });
    
    console.log(`Status: ${healthResponse.status}`);
    const result = await healthResponse.text();
    console.log('Response:', result);

    // 2. Test MinIO
    console.log('\n2. Test MinIO...');
    const minioResponse = await fetch('http://localhost:9000/minio/health/live');
    console.log(`MinIO Status: ${minioResponse.status} - ${minioResponse.ok ? 'OK' : 'ERREUR'}`);

    // 3. Test console MinIO
    console.log('\n3. Test console MinIO...');
    const consoleResponse = await fetch('http://localhost:9001');
    console.log(`Console Status: ${consoleResponse.status} - ${consoleResponse.ok ? 'OK' : 'ERREUR'}`);

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testAPI();