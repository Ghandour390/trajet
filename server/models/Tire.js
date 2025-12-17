import mongoose from 'mongoose';

const tireInspectionSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  pressure: { type: Number },
  depth: { type: Number },
  notes: { type: String },
  inspector: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const tireRotationSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  fromPosition: { type: String },
  toPosition: { type: String },
  km: { type: Number }
});

const tireSchema = new mongoose.Schema({
  serial: { type: String, required: true, unique: true, trim: true },
  position: { type: String, required: true },
  brand: { type: String },
  model: { type: String },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  trailerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trailer' },
  stockStatus: { type: String, enum: ['mounted', 'stock', 'retired'], default: 'mounted' },
  pressure: { type: Number },
  depth: { type: Number },
  wearPercent: { type: Number, min: 0, max: 100, default: 0 },
  installedAt: { type: Date, default: Date.now },
  purchaseDate: { type: Date },
  purchasePrice: { type: Number },
  retiredDate: { type: Date },
  retiredReason: { type: String },
  nextCheckKm: { type: Number, required: true },
  rotationHistory: [tireRotationSchema],
  inspections: [tireInspectionSchema]
}, { timestamps: true });

tireSchema.methods.needsAttention = function() {
  return this.pressure < 7 || this.depth < 3 || this.wearPercent > 80;
};

tireSchema.methods.addInspection = function(inspectionData) {
  this.inspections.push(inspectionData);
  if (inspectionData.pressure) this.pressure = inspectionData.pressure;
  if (inspectionData.depth) this.depth = inspectionData.depth;
  return this.save();
};

tireSchema.methods.rotate = function(toPosition, km) {
  this.rotationHistory.push({
    fromPosition: this.position,
    toPosition,
    km
  });
  this.position = toPosition;
  return this.save();
};

tireSchema.methods.getRemainingLifePercent = function() {
  return Math.max(0, 100 - this.wearPercent);
};

export default mongoose.model('Tire', tireSchema);
