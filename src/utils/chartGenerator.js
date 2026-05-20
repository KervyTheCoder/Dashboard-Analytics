// Fonctions utilitaires pour calculer des statistiques sur les données

function calculateStats(rows, columns) {
  const stats = {};
  columns.forEach(col => {
    const values = rows.map(r => r[col]).filter(v => v !== undefined && v !== null);
    const numericValues = values.map(v => Number(v)).filter(v => !isNaN(v));
    if (numericValues.length > 0) {
      const sum = numericValues.reduce((a, b) => a + b, 0);
      stats[col] = {
        type: 'numeric',
        count: numericValues.length,
        sum,
        avg: sum / numericValues.length,
        min: Math.min(...numericValues),
        max: Math.max(...numericValues)
      };
    } else {
      // Catégorielle
      const freq = {};
      values.forEach(v => { freq[v] = (freq[v] || 0) + 1; });
      stats[col] = {
        type: 'categorical',
        count: values.length,
        unique: Object.keys(freq).length,
        frequencies: freq
      };
    }
  });
  return stats;
}

module.exports = { calculateStats };.