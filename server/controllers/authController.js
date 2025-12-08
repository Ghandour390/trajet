import AuthService from "../services/authService.js";


class AuthController {
    // @ api / auth / login
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const { accessToken, refreshToken, user } = await AuthService.login(email, password);
            res.status(200).json({ accessToken, refreshToken, user });
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }
    // @ api / auth / register
    async register(req, res) {
        try {
            const userData = req.body;
            const user = await AuthService.register(userData);
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
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
}

export default new AuthController();