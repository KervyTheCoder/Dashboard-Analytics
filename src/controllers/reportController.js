const Report = require('../models/Report');
const Dataset = require('../models/Dataset');
const Analytics = require('../models/Analytics');
const fs = require('fs');
const path = require('path');

exports.getAll = (req, res, next) => {
  try {
    const reports = Report.findByUser(req.user.id);
    res.json(reports);
  } catch (err) {
    next(err);
  }
};

exports.create = (req, res, next) => {
  try {
    const { title, config } = req.body;
    if (!title || !config) {
      return res.status(400).json({ error: 'Title and config are required' });
    }
    const report = Report.create(req.user.id, title, config);
    res.status(201).json(report);
  } catch (err) {
    next(err);
  }
};

exports.getById = (req, res, next) => {
  try {
    const report = Report.findById(req.params.id);
    if (!report || report.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(report);
  } catch (err) {
    next(err);
  }
};

exports.deleteReport = (req, res, next) => {
  try {
    const result = Report.delete(req.params.id, req.user.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Report not found or unauthorized' });
    }
    res.json({ message: 'Report deleted' });
  } catch (err) {
    next(err);
  }
};

exports.exportReport = (req, res, next) => {
  try {
    const report = Report.findById(req.params.id);
    if (!report || report.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Report not found' });
    }
    // Génération d'un "rapport" simplifié (format JSON)
    const exportData = {
      title: report.title,
      generatedAt: new Date(),
      config: report.config,
    };
    const filename = `report-${report.id}.json`;
    const filePath = path.join(process.env.REPORT_DIR || './reports', filename);
    fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2));
    res.download(filePath, filename, () => {
      // Optionnel : supprimer après téléchargement
      fs.unlinkSync(filePath);
    });
  } catch (err) {
    next(err);
  }
};