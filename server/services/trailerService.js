import Trailer from '../models/Trailer.js';
import Tire from '../models/Tire.js';
import Trip from '../models/Trip.js';

class TrailerService {
  async findAll() {
    return await Trailer.find();
  }

  async findById(id) {
    return await Trailer.findById(id);
  }

  async create(trailerData) {
    const existing = await Trailer.findOne({ plateNumber: trailerData.plateNumber });
    if (existing) {
      throw new Error(`La remorque avec la plaque ${trailerData.plateNumber} existe déjà`);
    }

    const { tires: tiresData, ...trailerInfo } = trailerData;
    const trailer = await Trailer.create(trailerInfo);

    const tireIds = [];
    if (tiresData && tiresData.length > 0) {
      for (const tireData of tiresData) {
        const tire = await Tire.create({
          serial: tireData.serial || `${trailer.plateNumber}-T${tireIds.length + 1}`,
          position: tireData.position || `Position ${tireIds.length + 1}`,
          brand: tireData.brand,
          pressure: tireData.pressure,
          depth: tireData.depth,
          trailerId: trailer._id,
          stockStatus: 'mounted',
          nextCheckKm: (trailerInfo.currentKm || 0) + 10000,
          wearPercent: 0
        });
        tireIds.push(tire._id);
      }
    }

    trailer.tires = tireIds;
    await trailer.save();
    return trailer;
  }

  async update(id, trailerData) {
    return await Trailer.findByIdAndUpdate(id, trailerData, { new: true });
  }

  async delete(id) {
    return await Trailer.findByIdAndDelete(id);
  }

  async findAvailable(startAt, endAt) {
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
      status: { $in: ['available', 'in_use'] },
      _id: { $nin: busyTrailersIds }
    });
  }

  async findWithTires(id) {
    const trailer = await Trailer.findById(id);
    if (!trailer) throw new Error('Trailer not found');

    const tires = await Tire.find({ trailerId: id, stockStatus: 'mounted' });
    return { ...trailer.toObject(), tires };
  }
}

export default new TrailerService();
