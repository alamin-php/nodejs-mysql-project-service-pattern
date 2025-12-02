const authService = require("../services/authService");

class AuthController {
  async register(req, res) {
    try {
      const user = await authService.register(req.body);
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async logout(req, res) {
    res.json({ message: "Logout successful" });
  }
}

module.exports = new AuthController();
