import AuthService from "../services/authService.js";
import userService from "../services/userService.js";


class AuthController {
    // @ api / auth / login
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const { accessToken, refreshToken, user } = await AuthService.login(email, password);
            res.status(200).json({ success: true, token: accessToken, accessToken, refreshToken, user });
        } catch (error) {
            res.status(401).json({ success: false, message: error.message });
        }
    }
    // @ api / auth / register
    async register(req, res) {
        try {
            const userData = req.body;
            const user = await AuthService.register(userData);
            res.status(201).json({ success: true, user });
        } catch (error) {
            // Gestion des erreurs de validation Mongoose
            if (error.name === 'ValidationError') {
                const errors = Object.values(error.errors).map(err => err.message);
                return res.status(400).json({ success: false, error: errors });
            }
            res.status(400).json({ success: false, error: error.message });
        }
    }
    //@ api / auth / logout
    async logout(req, res) {
        try {
            const { refreshToken } = req.body;
            const result = await AuthService.logout(refreshToken);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    //@ api / auth / refresh
    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;
            const result = await AuthService.refreshToken(refreshToken);
            res.status(200).json(result);
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }
    //@ api / auth / my
    async my(req, res) {
        try {
            const userId = req.user.id;
            const user = await userService.findById(userId);
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }   
    }
    // @ api / auth /change-password
    async changePassword(req, res) {
        try {
            const userId = req.user.id;
            const { currentPassword, newPassword } = req.body;
            const result = await AuthService.changePassword(userId, currentPassword, newPassword);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

export default new AuthController();