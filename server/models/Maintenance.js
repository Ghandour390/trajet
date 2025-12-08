const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  vehicleRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  type: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  km: {
    type: Number,
    required: true
  },
  notes: {
    type: String
  },
  cost: {
    type: Number,
    min: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Maintenance', maintenanceSchema);
