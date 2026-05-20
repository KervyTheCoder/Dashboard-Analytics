const fs = require('fs');

function parseJSON(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) return reject(err);
      try {
        const parsed = JSON.parse(data);
        // Attendre un tableau d'objets
        if (!Array.isArray(parsed)) {
          return reject(new Error('JSON file must contain an array of objects'));
        }
        const columns = parsed.length > 0 ? Object.keys(parsed[0]) : [];
        resolve({ data: parsed, columns, rowCount: parsed.length });
      } catch (e) {
        reject(new Error('Invalid JSON format'));
      }
    });
  });
}

module.exports = { parseJSON };