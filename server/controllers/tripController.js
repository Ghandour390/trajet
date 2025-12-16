import tripService from '../services/tripService.js';

class TripController {
  //  Admin creates a trip
  // route POST /api/trips
  async createTrip(req, res) {
    try {
      const trip = await tripService.create(req.body);
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
      const trips = await tripService.findAll(filter);
      res.json(trips);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get trip by ID
  // route GET /api/trips/:id
  async getTripById(req, res) {
    try {
      const trip = await tripService.findById(req.params.id);
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
      const trip = await tripService.update(req.params.id, req.body);
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
      const trip = await tripService.delete(req.params.id);
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
      const trip = await tripService.updateStatus(req.params.id, status, req.user.id);
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
      const { startKm, endKm, description } = req.body;
      const trip = await tripService.updateMileage(req.params.id, startKm, endKm, description);
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
      const trip = await tripService.updateFuel(req.params.id, fuelVolume);
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
      const trip = await tripService.updateRemarks(req.params.id, remarks);
      if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
      }
      res.json(trip);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  // Get my trips (for drivers)
  // route GET /api/trips/my
  async getMyTrips(req, res) {
    try {
      const trips = await tripService.findByDriverId(req.user.id);
      res.json(trips);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new TripController();
