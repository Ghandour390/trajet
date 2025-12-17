import mongoose from 'mongoose';

const tireAlertSchema = new mongoose.Schema({
  tireId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tire', required: true },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  trailerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trailer' },
  alertType: { 
    type: String, 
    enum: ['low_pressure', 'low_depth', 'high_wear', 'check_due', 'old_age'],
    required: true 
  },
  severity: { type: String, enum: ['info', 'warning', 'critical'], default: 'warning' },
  message: { type: String, required: true },
  isResolved: { type: Boolean, default: false },
  resolvedAt: { type: Date },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('TireAlert', tireAlertSchema);
