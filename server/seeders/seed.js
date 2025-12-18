import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';
import Trailer from '../models/Trailer.js';
import Trip from '../models/Trip.js';
import Maintenance from '../models/Maintenance.js';
import Tire from '../models/Tire.js';
import Fuel from '../models/Fuel.js';
import Document from '../models/Document.js';
import Notification from '../models/Notification.js';
import TireAlert from '../models/TireAlert.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await Trailer.deleteMany({});
    await Trip.deleteMany({});
    await Maintenance.deleteMany({});
    await Tire.deleteMany({});
    await Fuel.deleteMany({});
    await Document.deleteMany({});
    await Notification.deleteMany({});
    await TireAlert.deleteMany({});
    console.log('Cleared existing data');

    // Create Users
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = await User.insertMany([
      {
        firstname: 'Admin',
        lastname: 'User',
        email: 'admin@trajetcamen.com',
        passwordHash: hashedPassword,
        role: 'admin',
        phone: '0612345678'
      },
      {
        firstname: 'Mohamed',
        lastname: 'Alami',
        email: 'mohamed@trajetcamen.com',
        passwordHash: hashedPassword,
        role: 'chauffeur',
        phone: '0623456789',
        licence: 'B123456'
      },
      {
        firstname: 'Fatima',
        lastname: 'Zahra',
        email: 'fatima@trajetcamen.com',
        passwordHash: hashedPassword,
        role: 'chauffeur',
        phone: '0634567890',
        licence: 'B234567'
      }
    ]);
    console.log('Created users');

    // Create Tires
    const tires = await Tire.insertMany([
      { serial: 'TIRE001', position: 'Avant Gauche', wearPercent: 20, nextCheckKm: 50000, pressure: 8.5, depth: 7, brand: 'Michelin', stockStatus: 'mounted' },
      { serial: 'TIRE002', position: 'Avant Droit', wearPercent: 25, nextCheckKm: 50000, pressure: 8.2, depth: 6.5, brand: 'Michelin', stockStatus: 'mounted' },
      { serial: 'TIRE003', position: 'Arrière Gauche', wearPercent: 30, nextCheckKm: 45000, pressure: 8.0, depth: 6, brand: 'Bridgestone', stockStatus: 'mounted' },
      { serial: 'TIRE004', position: 'Arrière Droit', wearPercent: 28, nextCheckKm: 45000, pressure: 7.8, depth: 6.2, brand: 'Bridgestone', stockStatus: 'mounted' },
      { serial: 'TIRE005', position: 'Avant Gauche', wearPercent: 15, nextCheckKm: 55000, pressure: 8.7, depth: 8, brand: 'Continental', stockStatus: 'mounted' },
      { serial: 'TIRE006', position: 'Avant Droit', wearPercent: 18, nextCheckKm: 55000, pressure: 8.5, depth: 7.5, brand: 'Continental', stockStatus: 'mounted' },
      { serial: 'TIRE007', position: 'Arrière Gauche', wearPercent: 85, nextCheckKm: 5000, pressure: 6.5, depth: 2.5, brand: 'Goodyear', stockStatus: 'mounted' },
      { serial: 'TIRE008', position: 'Arrière Droit', wearPercent: 82, nextCheckKm: 6000, pressure: 6.8, depth: 2.8, brand: 'Goodyear', stockStatus: 'mounted' },
      { serial: 'TIRE009', position: 'Avant Gauche', wearPercent: 10, nextCheckKm: 60000, pressure: 8.8, depth: 8.5, brand: 'Michelin', stockStatus: 'mounted' },
      { serial: 'TIRE010', position: 'Avant Droit', wearPercent: 12, nextCheckKm: 60000, pressure: 8.6, depth: 8.2, brand: 'Michelin', stockStatus: 'mounted' },
      { serial: 'TIRE011', position: 'Stock', wearPercent: 0, nextCheckKm: 100000, pressure: 9, depth: 10, brand: 'Pirelli', stockStatus: 'stock' },
      { serial: 'TIRE012', position: 'Stock', wearPercent: 0, nextCheckKm: 100000, pressure: 9, depth: 10, brand: 'Pirelli', stockStatus: 'stock' }
    ]);
    console.log('Created tires');

    // Create Vehicles
    const vehicles = await Vehicle.insertMany([
      {
        plateNumber: 'A-12345-B',
        type: 'Camion',
        brand: 'Mercedes',
        model: 'Actros',
        year: 2020,
        currentKm: 45000,
        status: 'maintenance',
        fuelType: 'Diesel',
        tires: [tires[0]._id, tires[1]._id, tires[2]._id, tires[3]._id]
      },
      {
        plateNumber: 'A-67890-B',
        type: 'Camion',
        brand: 'Volvo',
        model: 'FH16',
        year: 2021,
        currentKm: 30000,
        status: 'in_use',
        fuelType: 'Diesel',
        tires: [tires[4]._id, tires[5]._id, tires[6]._id, tires[7]._id]
      },
      {
        plateNumber: 'A-11111-B',
        type: 'Camionnette',
        brand: 'Renault',
        model: 'Master',
        year: 2022,
        currentKm: 15000,
        status: 'maintenance',
        fuelType: 'Diesel',
        tires: [tires[8]._id, tires[9]._id]
      }
    ]);
    
    // Update tires with vehicleId
    await Tire.updateMany({ _id: { $in: [tires[0]._id, tires[1]._id, tires[2]._id, tires[3]._id] } }, { vehicleId: vehicles[0]._id });
    await Tire.updateMany({ _id: { $in: [tires[4]._id, tires[5]._id, tires[6]._id, tires[7]._id] } }, { vehicleId: vehicles[1]._id });
    await Tire.updateMany({ _id: { $in: [tires[8]._id, tires[9]._id] } }, { vehicleId: vehicles[2]._id });
    console.log('Created vehicles');

    // Create Trailers
    const trailerTires = await Tire.insertMany([
      { serial: 'TIRE-T001', position: 'Avant Gauche', wearPercent: 35, nextCheckKm: 40000, pressure: 8.0, depth: 5.5, brand: 'Michelin', stockStatus: 'mounted' },
      { serial: 'TIRE-T002', position: 'Avant Droit', wearPercent: 38, nextCheckKm: 40000, pressure: 7.9, depth: 5.2, brand: 'Michelin', stockStatus: 'mounted' },
      { serial: 'TIRE-T003', position: 'Arrière Gauche', wearPercent: 20, nextCheckKm: 50000, pressure: 8.5, depth: 7, brand: 'Continental', stockStatus: 'mounted' },
      { serial: 'TIRE-T004', position: 'Arrière Droit', wearPercent: 22, nextCheckKm: 50000, pressure: 8.4, depth: 6.8, brand: 'Continental', stockStatus: 'mounted' }
    ]);

    const trailers = await Trailer.insertMany([
      {
        plateNumber: 'R-11111-B',
        type: 'Frigorifique',
        brand: 'Schmitz',
        model: 'Cargobull',
        year: 2019,
        capacity: 33,
        currentKm: 40000,
        status: 'in_use',
        attachedTo: vehicles[0]._id,
        tires: [trailerTires[0]._id, trailerTires[1]._id]
      },
      {
        plateNumber: 'R-22222-B',
        type: 'Bâchée',
        brand: 'Krone',
        model: 'Profi Liner',
        year: 2020,
        capacity: 28,
        currentKm: 25000,
        status: 'available',
        tires: [trailerTires[2]._id, trailerTires[3]._id]
      }
    ]);
    
    await Tire.updateMany({ _id: { $in: [trailerTires[0]._id, trailerTires[1]._id] } }, { trailerId: trailers[0]._id });
    await Tire.updateMany({ _id: { $in: [trailerTires[2]._id, trailerTires[3]._id] } }, { trailerId: trailers[1]._id });
    console.log('Created trailers');

    // Create Trips - More data
    const now = new Date();
    const trips = [];
    const cities = ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Oujda'];
    for (let i = 0; i < 50; i++) {
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - i);
      const distance = Math.round(200 + Math.random() * 500);
      const startKm = 10000 + i * 500;
      trips.push({
        reference: `TRIP${String(i + 1).padStart(3, '0')}`,
        origin: cities[i % cities.length],
        destination: cities[(i + 1) % cities.length],
        assignedTo: users[(i % 2) + 1]._id,
        vehicleRef: vehicles[i % 3]._id,
        startKm: startKm,
        endKm: i < 30 ? startKm + distance : null,
        distance: i < 30 ? distance : null,
        distimatedKm: distance,
        status: i < 30 ? 'completed' : i < 35 ? 'in_progress' : 'planned',
        startDate: startDate,
        endDate: i < 30 ? new Date(startDate.getTime() + 86400000) : null
      });
    }
    const tripsInserted = await Trip.insertMany(trips);
    console.log('Created 50 trips');

    // Create Maintenance - More data
    const maintenances = [];
    const types = ['Vidange', 'Freins', 'Pneus', 'Contrôle technique', 'Révision'];
    for (let i = 0; i < 15; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i * 7);
      maintenances.push({
        vehicleRef: vehicles[i % 3]._id,
        type: types[i % types.length],
        date: date,
        km: 10000 + i * 5000,
        notes: `Maintenance ${types[i % types.length]}`,
        cost: 500 + Math.random() * 2000,
        status: i < 10 ? 'completed' : 'pending'
      });
    }
    await Maintenance.insertMany(maintenances);
    console.log('Created 15 maintenance records');

    // Create Fuel Records - More data for charts
    const fuelRecords = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const liters = 50 + Math.random() * 100;
      fuelRecords.push({
        trip: tripsInserted[i % tripsInserted.length]._id,
        vehicle: vehicles[i % 3]._id,
        driver: users[(i % 2) + 1]._id,
        liters: liters,
        volume: liters,
        quantity: liters,
        cost: 800 + Math.random() * 1000,
        pricePerLiter: 15 + Math.random() * 2,
        station: ['Total', 'Shell', 'Afriquia'][i % 3],
        fuelType: 'diesel',
        date: date
      });
    }
    await Fuel.insertMany(fuelRecords);
    console.log('Created 30 fuel records');

    // Create Notifications
    await Notification.insertMany([
      {
        userId: users[0]._id,
        type: 'trip_status_change',
        title: 'Trajet terminé',
        message: 'Le chauffeur Mohamed Alami a terminé le trajet TRIP001',
        severity: 'info',
        isRead: false
      },
      {
        userId: users[1]._id,
        type: 'trip_assignment',
        title: 'Nouveau trajet assigné',
        message: 'Vous avez été assigné au trajet TRIP003 de Agadir vers Casablanca',
        severity: 'info',
        isRead: false
      },
      {
        userId: users[0]._id,
        type: 'maintenance_alert',
        title: 'Maintenance programmée',
        message: 'Maintenance des freins prévue le 01/02/2024 pour A-12345-B',
        severity: 'warning',
        isRead: true
      },
      {
        userId: users[2]._id,
        type: 'trip_assignment',
        title: 'Nouveau trajet assigné',
        message: 'Vous avez été assigné au trajet TRIP004 de Fès vers Oujda',
        severity: 'info',
        isRead: false
      }
    ]);
    console.log('Created notifications');

    // Create Tire Alerts
    await TireAlert.insertMany([
      {
        tireId: tires[6]._id,
        vehicleId: vehicles[1]._id,
        alertType: 'high_wear',
        severity: 'critical',
        message: 'Pneu TIRE007 - Usure critique (85%), remplacement urgent requis',
        isResolved: false
      },
      {
        tireId: tires[7]._id,
        vehicleId: vehicles[1]._id,
        alertType: 'high_wear',
        severity: 'critical',
        message: 'Pneu TIRE008 - Usure critique (82%), remplacement urgent requis',
        isResolved: false
      },
      {
        tireId: tires[6]._id,
        vehicleId: vehicles[1]._id,
        alertType: 'low_pressure',
        severity: 'warning',
        message: 'Pneu TIRE007 - Pression basse (6.5 bar), gonflage requis',
        isResolved: false
      },
      {
        tireId: tires[7]._id,
        vehicleId: vehicles[1]._id,
        alertType: 'low_depth',
        severity: 'warning',
        message: 'Pneu TIRE008 - Profondeur faible (2.8 mm), surveillance requise',
        isResolved: false
      }
    ]);
    console.log('Created tire alerts');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📊 Données créées:');
    console.log('- 3 utilisateurs (1 admin, 2 chauffeurs)');
    console.log('- 3 véhicules (2 en maintenance)');
    console.log('- 2 remorques');
    console.log('- 50 trajets (30 complétés, 5 en cours, 15 planifiés)');
    console.log('- 4 maintenances');
    console.log('- 30 enregistrements carburant');
    console.log('- 4 notifications');
    console.log('- 4 alertes pneus');
    console.log('\n🔑 Identifiants de test:');
    console.log('Admin: admin@trajetcamen.com / password123');
    console.log('Chauffeur 1: mohamed@trajetcamen.com / password123');
    console.log('Chauffeur 2: fatima@trajetcamen.com / password123');

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
