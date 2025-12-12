import Trailer from '../models/Trailer.js';
import Tire from '../models/Tire.js';
import Trip from '../models/Trip.js';

class TrailerService {
  async create(trailerData) {
    const existing = await Trailer.findOne({ plateNumber: trailerData.plateNumber });
    if (existing) {
      throw new Error(`La remorque avec la plaque ${trailerData.plateNumber} existe déjà`);
    }
    
    const newTrailer = await Trailer.create(trailerData);
    
    // Créer automatiquement des pneus par défaut
    const tires = [];
    
    for (let i = 0; i < 4; i++) {
      const tire = await Tire.create({
        serial: `${newTrailer.plateNumber}-T${i + 1}`,
        position: `Position ${i + 1}`,
        nextCheckKm: (trailerData.currentKm || 0) + 10000
      });
      tires.push(tire._id);
    }
    
    newTrailer.tires = tires;
    await newTrailer.save();
    
    return newTrailer;
  }

  async findAll() {
    return await Trailer.find().populate('attachedTo', 'plateNumber');
  }

  async findById(id) {
    return await Trailer.findById(id).populate('attachedTo', 'plateNumber');
  }

  async update(id, trailerData) {
    return await Trailer.findByIdAndUpdate(id, trailerData, { new: true });
  }

  async delete(id) {
    return await Trailer.findByIdAndDelete(id);
  }

  async findAvailableTrailers(startAt, endAt) {
    const start = new Date(startAt);
    const end = endAt ? new Date(endAt) : new Date(startAt);

    const busyTrailersIds = await Trip.find({
      $or: [
        { startAt: { $lte: end }, endAt: { $gte: start } },
        { startAt: { $gte: start, $lte: end } }
      ],
      status: { $in: ['planned', 'in_progress'] }
    }).distinct('trailerRef');

    return await Trailer.find({
      _id: { $nin: busyTrailersIds }
    });
  }
}

export default new TrailerService();
