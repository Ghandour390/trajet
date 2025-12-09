import User from '../models/User.js';

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
}

export default new UserService();
