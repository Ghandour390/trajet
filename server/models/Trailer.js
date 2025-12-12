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
    required: true
  },
  currentKm: {
    type: Number,
    default: 0
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
