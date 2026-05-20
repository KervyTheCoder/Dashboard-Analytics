const Dataset = require('../models/Dataset');
const Analytics = require('../models/Analytics');
const { calculateStats } = require('../utils/chartGenerator');
const { parseCSV } = require('../utils/csvParser');
const { parseJSON } = require('../utils/jsonParser');
const fs = require('fs');
const path = require('path');

exports.getAll = (req, res, next) => {
  try {
    const datasets = Dataset.findByUser(req.user.id);
    res.json(datasets);
  } catch (err) {
    next(err);
  }
};

exports.getById = (req, res, next) => {
  try {
    const dataset = Dataset.findById(req.params.id);
    if (!dataset || dataset.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Dataset not found' });
    }
    res.json(dataset);
  } catch (err) {
    next(err);
  }
};

exports.importData = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    let parsed;
    if (ext === '.csv') {
      parsed = await parseCSV(filePath);
    } else if (ext === '.json') {
      parsed = await parseJSON(filePath);
    } else {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: 'Unsupported file type. Use CSV or JSON.' });
    }
    // Supprimer le fichier uploadé après parsing
    fs.unlinkSync(filePath);
    
    const dataset = Dataset.create(
      req.user.id,
      req.file.originalname,
      ext.slice(1),
      parsed.data,
      parsed.columns,
      parsed.rowCount
    );
    
    // Calculer et mettre en cache les statistiques
    const stats = calculateStats(parsed.data, parsed.columns);
    Analytics.clearCache(dataset.id);
    Analytics.cacheStats(dataset.id, stats);
    
    res.status(201).json({ message: 'Data imported successfully', dataset });
  } catch (err) {
    // Nettoyer le fichier en cas d'erreur
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    next(err);
  }
};

exports.deleteDataset = (req, res, next) => {
  try {
    const result = Dataset.delete(req.params.id, req.user.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Dataset not found or unauthorized' });
    }
    res.json({ message: 'Dataset deleted' });
  } catch (err) {
    next(err);
  }
};

exports.search = (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query parameter q required' });
    const results = Dataset.search(req.user.id, q);
    res.json(results);
  } catch (err) {
    next(err);
  }
};

exports.filter = (req, res, next) => {
  try {
    // Filtrage simple par nom de colonne/valeur (exemple)
    const { column, value } = req.query;
    const datasets = Dataset.findByUser(req.user.id);
    const filtered = datasets.filter(d => {
      if (!column || !value) return true;
      const fullDataset = Dataset.findById(d.id);
      return fullDataset.data.some(row => String(row[column]).includes(value));
    });
    res.json(filtered);
  } catch (err) {
    next(err);
  }
};