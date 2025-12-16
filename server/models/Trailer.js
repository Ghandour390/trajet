import mongoose from 'mongoose';

const trailerSchema = new mongoose.Schema({
  plateNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Frigorifique', 'Bâchée', 'Plateau', 'Citerne', 'Porte-conteneur']
  },
  brand: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  currentKm: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['available', 'in_use', 'maintenance', 'out_of_service'],
    default: 'available'
  },
  tires: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tire'
  }],
  attachedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  }
}, {
  timestamps: true
});

export default mongoose.model('Trailer', trailerSchema);
