import request from 'supertest';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Upload Profile Image', () => {
  let token;
  let userId;

  beforeAll(async () => {
    // Connexion et récupération du token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@trajet.com',
        password: 'admin123'
      });
    
    token = loginRes.body.token;
    userId = loginRes.body.user._id;
  });

  describe('POST /api/users/:id/profile-image', () => {
    it('devrait uploader une image JPG valide', async () => {
      const imagePath = path.join(__dirname, '../fixtures/test-image.jpg');
      
      const response = await request(app)
        .post(`/api/users/${userId}/profile-image`)
        .set('Authorization', `Bearer ${token}`)
        .attach('image', imagePath);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('succès');
      expect(response.body.data.profileImage).toContain('http');
    });

    it('devrait uploader une image PNG valide', async () => {
      const imagePath = path.join(__dirname, '../fixtures/test-image.png');
      
      const response = await request(app)
        .post(`/api/users/${userId}/profile-image`)
        .set('Authorization', `Bearer ${token}`)
        .attach('image', imagePath);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('devrait rejeter un fichier sans image', async () => {
      const response = await request(app)
        .post(`/api/users/${userId}/profile-image`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Aucune image');
    });

    it('devrait rejeter un format PDF', async () => {
      const pdfPath = path.join(__dirname, '../fixtures/test.pdf');
      
      const response = await request(app)
        .post(`/api/users/${userId}/profile-image`)
        .set('Authorization', `Bearer ${token}`)
        .attach('image', pdfPath);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Format');
    });

    it('devrait rejeter une image trop volumineuse', async () => {
      // Créer un buffer de 6MB
      const largeBuffer = Buffer.alloc(6 * 1024 * 1024);
      
      const response = await request(app)
        .post(`/api/users/${userId}/profile-image`)
        .set('Authorization', `Bearer ${token}`)
        .attach('image', largeBuffer, 'large-image.jpg');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('volumineuse');
    });

    it('devrait rejeter si utilisateur inexistant', async () => {
      const imagePath = path.join(__dirname, '../fixtures/test-image.jpg');
      const fakeUserId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .post(`/api/users/${fakeUserId}/profile-image`)
        .set('Authorization', `Bearer ${token}`)
        .attach('image', imagePath);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('introuvable');
    });

    it('devrait rejeter sans authentification', async () => {
      const imagePath = path.join(__dirname, '../fixtures/test-image.jpg');
      
      const response = await request(app)
        .post(`/api/users/${userId}/profile-image`)
        .attach('image', imagePath);

      expect(response.status).toBe(401);
    });
  });
});
