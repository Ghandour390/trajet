import vehicleService from "../services/vehicleService.js";



class VehicleController {
    // @desc    Get all vehicles
    // @route   GET /api/vehicles
    async getAllVehicles(req, res) {
        try {
            const vehicles = await vehicleService.findAll();
            res.status(200).json(vehicles);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    // @desc    Get vehicle by ID
    // @route   GET /api/vehicles/:id
    async getVehicleById(req, res) {
        try {
            const vehicle = await vehicleService.findById(req.params.id);
            if (!vehicle) {
                return res.status(404).json({ message: 'Vehicle not found' });
            }
            res.status(200).json(vehicle);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    // @desc    Create new vehicle
    // @route   POST /api/vehicles
    async createVehicle(req, res) { 
        try {
            const vehicle = await vehicleService.create(req.body);
            res.status(201).json(vehicle);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    // @desc    Update vehicle
    // @route   PATCH /api/vehicles/:id
    async updateVehicle(req, res) {
        try {
            const vehicle = await vehicleService.update(req.params.id, req.body);
            if (!vehicle) {
                return res.status(404).json({ message: 'Vehicle not found' });
            }
            res.status(200).json(vehicle);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    // @desc    Delete vehicle
    // @route   DELETE /api/vehicles/:id
    async deleteVehicle(req, res) {
        try {
            const vehicle = await vehicleService.delete(req.params.id);
            if (!vehicle) { 
                return res.status(404).json({ message: 'Vehicle not found' });
            }
            res.status(200).json({ message: 'Vehicle deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // @desc    Get available vehicles for a date
    // @route   GET /api/vehicles/disponibles?startAt=YYYY-MM-DD&endAt=YYYY-MM-DD
    async getAvailableVehicles(req, res) {
        try {
            const { startAt, endAt } = req.query;
            if (!startAt) {
                return res.status(400).json({ message: 'startAt est obligatoire' });
            }
            const vehicles = await vehicleService.findAvailableVehicles(startAt, endAt);
            res.status(200).json(vehicles);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // @desc    Get vehicle with tires
    // @route   GET /api/vehicles/:id/tires
    async getVehicleWithTires(req, res) {
        try {
            const vehicle = await vehicleService.findByIdWithTires(req.params.id);
            if (!vehicle) {
                return res.status(404).json({ message: 'Vehicle not found' });
            }
            res.status(200).json(vehicle);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default new VehicleController();