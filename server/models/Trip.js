import mongoose from 'mongoose';

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
    required: false
  },
  vehicleRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: false,
    default: null
  },
  trailerRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trailer',
    required: false,
    default: null
  },
  startKm: {
    type: Number,
    required: false
  },
  endKm: {
    type: Number
  },
  distimatedKm: {
    type: Number ,
    required: true
  },
  distance: {
    type: Number
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
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
  },
  description: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Trip', tripSchema);
