const fs = require('fs');
const csv = require('csv-parser');

function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        const columns = results.length > 0 ? Object.keys(results[0]) : [];
        resolve({ data: results, columns, rowCount: results.length });
      })
      .on('error', reject);
  });
}

module.exports = { parseCSV };