const { getDatabase } = require('../utils/database');

class Analytics {
  static cacheStats(datasetId, results) {
    const db = getDatabase();
    const stmt = db.prepare('INSERT INTO analytics_cache (dataset_id, stat_type, result) VALUES (?, ?, ?)');
    for (const [col, stat] of Object.entries(results)) {
      stmt.run(datasetId, col, JSON.stringify(stat));
    }
  }

  static getCachedStats(datasetId) {
    const db = getDatabase();
    const rows = db.prepare('SELECT stat_type, result FROM analytics_cache WHERE dataset_id = ?').all(datasetId);
    const stats = {};
    rows.forEach(r => { stats[r.stat_type] = JSON.parse(r.result); });
    return stats;
  }

  static clearCache(datasetId) {
    const db = getDatabase();
    db.prepare('DELETE FROM analytics_cache WHERE dataset_id = ?').run(datasetId);
  }
}

module.exports = Analytics;