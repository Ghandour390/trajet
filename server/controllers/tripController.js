import Trip from '../models/Trip.js';

class TripController {
  //  Admin creates a trip
  // route POST /api/trips
  async createTrip(req, res) {
    try {
      const trip = await Trip.create(req.body);
      res.status(201).json(trip);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get all trips
  // route GET /api/trips
  async getAllTrips(req, res) {
    try {
      const filter = req.user.role === 'chauffeur' ? { assignedTo: req.user.id } : {};
      const trips = await Trip.find(filter)
        .populate('assignedTo', 'firstname lastname')
        .populate('vehicleRef', 'plateNumber')
        .populate('trailerRef', 'plateNumber');
      res.json(trips);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get trip by ID
  // route GET /api/trips/:id
  async getTripById(req, res) {
    try {
      const trip = await Trip.findById(req.params.id)
        .populate('assignedTo', 'firstname lastname')
        .populate('vehicleRef', 'plateNumber')
        .populate('trailerRef', 'plateNumber');
      if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
      }
      res.json(trip);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  //  Assign driver to trip
  // route PATCH /api/trips/:id/assign

  async updateTrip(req, res) {
    try {
      const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
      }
      res.json(trip);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Delete trip
  // route DELETE /api/trips/:id
  async deleteTrip(req, res) {
    try {
      const trip = await Trip.findByIdAndDelete(req.params.id);
      if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
      }
      res.json({ message: 'Trip deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  //  Driver updates trip status
  // route PATCH /api/trips/:id/status
  async updateStatus(req, res) {
    try {
      const { status } = req.body;
      const trip = await Trip.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
      if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
      }
      res.json(trip);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  //  Save KM + Fuel
  // route PATCH /api/trips/:id/mileage
  async updateMileage(req, res) {
    try {
      const { startKm, endKm } = req.body;
      const trip = await Trip.findByIdAndUpdate(
        req.params.id,
        { startKm, endKm },
        { new: true }
      );
      if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
      }
      res.json(trip);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  // Save Fuel Volume
  // route PATCH /api/trips/:id/fuel
  async updateFuel(req, res) {
    try {
      const { fuelVolume } = req.body;
      const trip = await Trip.findByIdAndUpdate(
        req.params.id,
        { fuelVolume },
        { new: true }
      );
      if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
      }
      res.json(trip);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  // Save Remarks
  // route PATCH /api/trips/:id/remarks
  async updateRemarks(req, res) {
    try {
      const { remarks } = req.body;
      const trip = await Trip.findByIdAndUpdate(
        req.params.id,
        { remarks },
        { new: true }
      );
      if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
      }
      res.json(trip);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new TripController();
