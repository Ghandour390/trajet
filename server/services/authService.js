import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


class AuthService {
  async register(userData) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('Email already exists');
    }
    
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = new User({
      ...userData,
      passwordHash: hashedPassword,
      role: userData.role || 'chauffeur'
    });
    const savedUser = await user.save();
    const { passwordHash: _passwordHash, ...userWithoutPassword } = savedUser.toObject();
    return userWithoutPassword;
  }

  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password");
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage
      }
    };
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.id);
      
      if (!user) {
        throw new Error("User not found");
      }

      const accessToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      return { accessToken };
    } catch (error) {
      if (error.message === "User not found") {
        throw error;
      }
      throw new Error("Invalid refresh token");
    }
  }
  async logout(refreshToken) {
    try {
      jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      return { message: "Logged out successfully" };
    } catch {
      throw new Error("Invalid refresh token");
    }
  }
    async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      throw new Error("Current password is incorrect");
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.passwordHash = hashedNewPassword;
    await user.save();
    return { message: "Password changed successfully" };
  }
}

export default new AuthService();