import Trailer from '../models/Trailer.js';

class TrailerService {
  async create(trailerData) {
    return await Trailer.create(trailerData);
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
}

export default new TrailerService();
