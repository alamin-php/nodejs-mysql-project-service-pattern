const userService = require("../services/userService");

class UserController {
  async getUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getUser(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async createUser(req, res) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateUser(req, res) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const user = await userService.deleteUser(req.params.id);
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new UserController();
