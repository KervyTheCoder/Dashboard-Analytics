const { getDatabase } = require('../utils/database');

class User {
  static create(username, email, passwordHash, role = 'user') {
    const db = getDatabase();
    const stmt = db.prepare('INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)');
    const info = stmt.run(username, email, passwordHash, role);
    return this.findById(info.lastInsertRowid);
  }

  static findById(id) {
    const db = getDatabase();
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  }

  static findByEmail(email) {
    const db = getDatabase();
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  }

  static findByUsername(username) {
    const db = getDatabase();
    return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  }
}

module.exports = User;