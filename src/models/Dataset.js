const { getDatabase } = require('../utils/database');
const { v4: uuidv4 } = require('uuid');

class Dataset {
  static create(userId, name, fileType, data, columns, rowCount) {
    const db = getDatabase();
    const id = uuidv4();
    const stmt = db.prepare('INSERT INTO datasets (id, user_id, name, file_type, data, columns, row_count) VALUES (?, ?, ?, ?, ?, ?, ?)');
    stmt.run(id, userId, name, fileType, JSON.stringify(data), JSON.stringify(columns), rowCount);
    return this.findById(id);
  }

  static findById(id) {
    const db = getDatabase();
    const row = db.prepare('SELECT * FROM datasets WHERE id = ?').get(id);
    if (row) {
      row.data = JSON.parse(row.data);
      row.columns = JSON.parse(row.columns);
    }
    return row;
  }

  static findByUser(userId) {
    const db = getDatabase();
    return db.prepare('SELECT id, user_id, name, file_type, row_count, created_at FROM datasets WHERE user_id = ?').all(userId);
  }

  static delete(id, userId) {
    const db = getDatabase();
    return db.prepare('DELETE FROM datasets WHERE id = ? AND user_id = ?').run(id, userId);
  }

  static search(userId, query) {
    const db = getDatabase();
    return db.prepare("SELECT * FROM datasets WHERE user_id = ? AND name LIKE ?").all(userId, `%${query}%`);
  }
}

module.exports = Dataset;