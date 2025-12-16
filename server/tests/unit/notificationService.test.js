import { validateTripAssignment } from '../../services/notificationService.js';

describe('NotificationService - validateTripAssignment', () => {
  test('devrait retourner un objet avec valid et errors', async () => {
    const result = await validateTripAssignment('invalid_id', null, 200);
    
    expect(result).toHaveProperty('valid');
    expect(result).toHaveProperty('errors');
    expect(typeof result.valid).toBe('boolean');
    expect(Array.isArray(result.errors)).toBe(true);
  });

  test('devrait retourner erreur si véhicule introuvable', async () => {
    const result = await validateTripAssignment('invalid_id', null, 200);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Véhicule introuvable');
  });
});
