import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


class AuthService {
  async register(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
    const user = new User(userData);
    user.role = 'chauffeur'; // Default role
    return await user.save();
  }
  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password");
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
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
        role: user.role
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
    // In a stateless JWT implementation, logout is typically handled client-side
    // However, you could implement a token blacklist here if needed
    // For now, we'll just verify the token is valid before "logging out"
    try {
      jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      return { message: "Logged out successfully" };
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  }
}

export default new AuthService();