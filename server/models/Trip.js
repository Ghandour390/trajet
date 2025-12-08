const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  reference: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  origin: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vehicleRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  trailerRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trailer'
  },
  startKm: {
    type: Number,
    required: true
  },
  endKm: {
    type: Number
  },
  fuelVolume: {
    type: Number
  },
  status: {
    type: String,
    enum: ['planned', 'in_progress', 'completed', 'cancelled'],
    default: 'planned'
  },
  startAt: {
    type: Date
  },
  endAt: {
    type: Date
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Trip', tripSchema);
