const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthService {
  async register(user) {
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

  async login(email, password) {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, results) => {
          if (err) return reject(err);
          if (!results[0]) return reject(new Error("User not found"));

          const user = results[0];
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) return reject(new Error("Invalid password"));

          // Generate JWT
          const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || "1h" }
          );
          resolve({
            user: { id: user.id, name: user.name, email: user.email },
            token,
          });
        }
      );
    });
  }

  async verifyToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded);
      });
    });
  }
}

module.exports = new AuthService();
