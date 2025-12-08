import mongoose from 'mongoose';

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

export default mongoose.model('Maintenance', maintenanceSchema);
