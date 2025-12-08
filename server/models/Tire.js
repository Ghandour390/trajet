import mongoose from 'mongoose';

const tireSchema = new mongoose.Schema({
  serial: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  position: {
    type: String,
    required: true
  },
  wearPercent: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  installedAt: {
    type: Date,
    default: Date.now
  },
  nextCheckKm: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Tire', tireSchema);
