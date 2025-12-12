import User from '../models/User.js';
import Trip from '../models/Trip.js';

class UserService {
  async findAll() {
    return await User.find().select('-password');
  }

  async findById(id) {
    return await User.findById(id).select('-password');
  }

  async create(userData) {
    return await User.create(userData);
  }

  async update(id, userData) {
    return await User.findByIdAndUpdate(id, userData, {
      new: true,
      runValidators: true
    }).select('-password');
  }

  async delete(id) {
    return await User.findByIdAndDelete(id);
  }
  async getMyTrips() {
    trips = this.find({ role: 'chauffeur' });
    return trips;
  }

  async findAvailableChauffeurs(startAt, endAt) {
    const start = new Date(startAt);
    const end = endAt ? new Date(endAt) : new Date(startAt);

    const busyChauffeursIds = await Trip.find({
      $or: [
        { startAt: { $lte: end }, endAt: { $gte: start } },
        { startAt: { $gte: start, $lte: end } }
      ],
      status: { $in: ['planned', 'in_progress'] }
    }).distinct('assignedTo');

    return await User.find({
      role: 'chauffeur',
      _id: { $nin: busyChauffeursIds }
    }).select('-passwordHash');
  }
}

export default new UserService();
