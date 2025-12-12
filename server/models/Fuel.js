import mongoose from 'mongoose';

const fuelSchema = new mongoose.Schema({
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  liters: {
    type: Number,
    required: true,
    min: 0
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  pricePerLiter: {
    type: Number
  },
  station: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  odometer: {
    type: Number,
    min: 0
  },
  fuelType: {
    type: String,
    enum: ['diesel', 'essence', 'gpl'],
    default: 'diesel'
  },
  receipt: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Calculate price per liter before saving
fuelSchema.pre('save', async function() {
  if (this.liters && this.cost) {
    this.pricePerLiter = this.cost / this.liters;
  }
});

export default mongoose.model('Fuel', fuelSchema);
