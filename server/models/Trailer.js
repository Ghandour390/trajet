const mongoose = require('mongoose');

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
  attachedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Trailer', trailerSchema);
