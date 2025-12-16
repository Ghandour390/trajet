import mongoose from 'mongoose';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

const createTestNotifications = async () => {
  try {
    // Trouver un admin
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('Aucun admin trouvé');
      return;
    }

    // Créer des notifications de test
    await Notification.create([
      {
        userId: admin._id,
        type: 'trip_assignment',
        title: 'Test Notification 1',
        message: 'Ceci est une notification de test',
        severity: 'info',
        isRead: false
      },
      {
        userId: admin._id,
        type: 'trip_status_change',
        title: 'Test Notification 2',
        message: 'Une autre notification de test',
        severity: 'warning',
        isRead: false
      }
    ]);

    console.log('✅ Notifications de test créées');
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
};

export default createTestNotifications;