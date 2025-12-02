const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class UserService {
  getAllUsers() {
    return new Promise((resolve, reject) => {
      db.query("SELECT id,name,email FROM users", (err, results) => {
        if (err) return reject(err);
        // resolve({ results });
        resolve(JSON.parse(JSON.stringify(results)));
      });
    });
  }

  getUserById(id) {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT id,name,email FROM users WHERE id=?",
        [id],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0]);
        }
      );
    });
  }

  async createUser(user) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [user.name, user.email, hashedPassword],
        (err, results) => {
          if (err) return reject(err);
          resolve({
            id: results.insertId,
            name: user.name,
            email: user.email,
          });
        }
      );
    });
  }

  updateUser(id, user) {
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE users SET name=?, email=? WHERE id=?",
        [user.name, user.email, id],
        (err) => {
          if (err) return reject(err);
          resolve({ id, ...user });
        }
      );
    });
  }

  deleteUser(id) {
    return new Promise((resolve, reject) => {
      db.query("DELETE FROM users WHERE id=?", [id], (err) => {
        if (err) return reject(err);
        resolve({ message: "User deleted successfully" });
      });
    });
  }
}

module.exports = new UserService();
