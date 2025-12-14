import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'chauffeur'],
    required: true
  },
  phone: {
    type: String,
    trim: true
  },
  licence: {
    type: String,
    trim: true
  },
  profileImage: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);
