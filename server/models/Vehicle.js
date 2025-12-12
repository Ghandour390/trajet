import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  plateNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  type: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  currentKm: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'in_use', 'maintenance', 'inactive'],
    default: 'active'
  },
  tires: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tire'
  }],
  maintenanceDueDates: [{
    type: Date
  }]
}, {
  timestamps: true
});

export default mongoose.model('Vehicle', vehicleSchema);
