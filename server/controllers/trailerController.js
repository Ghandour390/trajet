import Trailer from '../models/Trailer.js';
import Tire from '../models/Tire.js';
import Trip from '../models/Trip.js';

class TrailerController {
    async getAllTrailers(req, res) {
        try {
            const trailers = await Trailer.find();
            res.status(200).json(trailers);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getTrailerById(req, res) {
        try {
            const trailer = await Trailer.findById(req.params.id);
            if (!trailer) return res.status(404).json({ message: 'Trailer not found' });
            res.status(200).json(trailer);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async createTrailer(req, res) { 
        try {
            const existing = await Trailer.findOne({ plateNumber: req.body.plateNumber });
            if (existing) return res.status(400).json({ message: `La remorque avec la plaque ${req.body.plateNumber} existe déjà` });
            
            const { tires: tiresData, ...trailerInfo } = req.body;
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
            
            res.status(201).json(trailer);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateTrailer(req, res) {
        try {
            const trailer = await Trailer.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!trailer) return res.status(404).json({ message: 'Trailer not found' });
            res.status(200).json(trailer);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteTrailer(req, res) {
        try {
            const trailer = await Trailer.findByIdAndDelete(req.params.id);
            if (!trailer) return res.status(404).json({ message: 'Trailer not found' });
            res.status(200).json({ message: 'Trailer deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getAvailableTrailers(req, res) {
        try {
            const { startAt, endAt } = req.query;
            if (!startAt) return res.status(400).json({ message: 'startAt est obligatoire' });
            
            const start = new Date(startAt);
            const end = endAt ? new Date(endAt) : new Date(startAt);

            const busyTrailersIds = await Trip.find({
                $or: [
                    { startAt: { $lte: end }, endAt: { $gte: start } },
                    { startAt: { $gte: start, $lte: end } }
                ],
                status: { $in: ['planned', 'in_progress'] }
            }).distinct('trailerRef');

            const trailers = await Trailer.find({
                status: { $in: ['available', 'in_use'] },
                _id: { $nin: busyTrailersIds }
            });
            
            res.status(200).json(trailers);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getTrailerWithTires(req, res) {
        try {
            const trailer = await Trailer.findById(req.params.id);
            if (!trailer) return res.status(404).json({ message: 'Trailer not found' });

            const tires = await Tire.find({ trailerId: req.params.id, stockStatus: 'mounted' });
            res.status(200).json({ ...trailer.toObject(), tires });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default new TrailerController();
