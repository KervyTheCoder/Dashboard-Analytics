const { getDatabase } = require('../utils/database');
const { v4: uuidv4 } = require('uuid');

class Report {
  static create(userId, title, config) {
    const db = getDatabase();
    const id = uuidv4();
    db.prepare('INSERT INTO reports (id, user_id, title, config) VALUES (?, ?, ?, ?)')
      .run(id, userId, title, JSON.stringify(config));
    return this.findById(id);
  }

  static findById(id) {
    const db = getDatabase();
    const row = db.prepare('SELECT * FROM reports WHERE id = ?').get(id);
    if (row) row.config = JSON.parse(row.config);
    return row;
  }

  static findByUser(userId) {
    const db = getDatabase();
    return db.prepare('SELECT id, user_id, title, created_at FROM reports WHERE user_id = ? ORDER BY created_at DESC').all(userId);
  }

  static delete(id, userId) {
    const db = getDatabase();
    return db.prepare('DELETE FROM reports WHERE id = ? AND user_id = ?').run(id, userId);
  }
}

module.exports = Report;