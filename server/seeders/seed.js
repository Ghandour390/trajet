import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';
import Trailer from '../models/Trailer.js';
import Trip from '../models/Trip.js';
import Maintenance from '../models/Maintenance.js';
import Tire from '../models/Tire.js';

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
      { serial: 'TIRE001', position: 'Front Left', wearPercent: 20, nextCheckKm: 50000 },
      { serial: 'TIRE002', position: 'Front Right', wearPercent: 25, nextCheckKm: 50000 },
      { serial: 'TIRE003', position: 'Rear Left', wearPercent: 30, nextCheckKm: 45000 },
      { serial: 'TIRE004', position: 'Rear Right', wearPercent: 28, nextCheckKm: 45000 }
    ]);
    console.log('Created tires');

    // Create Vehicles
    const vehicles = await Vehicle.insertMany([
      {
        plateNumber: 'A-12345-B',
        type: 'Camion',
        brand: 'Mercedes',
        year: 2020,
        currentKm: 45000,
        status: 'active',
        tires: [tires[0]._id, tires[1]._id]
      },
      {
        plateNumber: 'A-67890-B',
        type: 'Camion',
        brand: 'Volvo',
        year: 2021,
        currentKm: 30000,
        status: 'in_use',
        tires: [tires[2]._id, tires[3]._id]
      }
    ]);
    console.log('Created vehicles');

    // Create Trailers
    const trailers = await Trailer.insertMany([
      {
        plateNumber: 'R-11111-B',
        type: 'Remorque frigorifique',
        currentKm: 40000,
        attachedTo: vehicles[0]._id
      },
      {
        plateNumber: 'R-22222-B',
        type: 'Remorque bâchée',
        currentKm: 25000
      }
    ]);
    console.log('Created trailers');

    // Create Trips
    await Trip.insertMany([
      {
        reference: 'TRIP001',
        origin: 'Casablanca',
        destination: 'Marrakech',
        assignedTo: users[1]._id,
        vehicleRef: vehicles[0]._id,
        trailerRef: trailers[0]._id,
        startKm: 45000,
        endKm: 45250,
        distimatedKm: 250,
        fuelVolume: 80,
        status: 'completed',
        startAt: new Date('2024-01-15'),
        endAt: new Date('2024-01-15')
      },
      {
        reference: 'TRIP002',
        origin: 'Rabat',
        destination: 'Tanger',
        assignedTo: users[2]._id,
        vehicleRef: vehicles[1]._id,
        startKm: 30000,
        distimatedKm: 350,
        status: 'in_progress',
        startAt: new Date()
      },
      {
        reference: 'TRIP003',
        origin: 'Agadir',
        destination: 'Casablanca',
        assignedTo: users[1]._id,
        vehicleRef: vehicles[0]._id,
        startKm: 45250,
        distimatedKm: 500,
        status: 'planned'
      }
    ]);
    console.log('Created trips');

    // Create Maintenance
    await Maintenance.insertMany([
      {
        vehicleRef: vehicles[0]._id,
        type: 'Vidange',
        date: new Date('2024-01-10'),
        km: 45000,
        notes: 'Vidange complète avec changement de filtre',
        cost: 1500
      },
      {
        vehicleRef: vehicles[1]._id,
        type: 'Révision',
        date: new Date('2024-01-05'),
        km: 30000,
        notes: 'Révision des 30000 km',
        cost: 3000
      }
    ]);
    console.log('Created maintenance records');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nTest credentials:');
    console.log('Admin: admin@trajetcamen.com / password123');
    console.log('Chauffeur 1: mohamed@trajetcamen.com / password123');
    console.log('Chauffeur 2: fatima@trajetcamen.com / password123');

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
