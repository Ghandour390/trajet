import trailerService from '../services/trailerService.js';

class TrailerController {
  async createTrailer(req, res) {
    try {
      const trailer = await trailerService.create(req.body);
      res.status(201).json(trailer);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllTrailers(req, res) {
    try {
      const trailers = await trailerService.findAll();
      res.json(trailers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getTrailerById(req, res) {
    try {
      const trailer = await trailerService.findById(req.params.id);
      if (!trailer) {
        return res.status(404).json({ message: 'Trailer not found' });
      }
      res.json(trailer);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateTrailer(req, res) {
    try {
      const trailer = await trailerService.update(req.params.id, req.body);
      if (!trailer) {
        return res.status(404).json({ message: 'Trailer not found' });
      }
      res.json(trailer);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteTrailer(req, res) {
    try {
      const trailer = await trailerService.delete(req.params.id);
      if (!trailer) {
        return res.status(404).json({ message: 'Trailer not found' });
      }
      res.json({ message: 'Trailer deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new TrailerController();
