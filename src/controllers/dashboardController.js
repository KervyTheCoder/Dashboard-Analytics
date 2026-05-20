const Dataset = require('../models/Dataset');
const Analytics = require('../models/Analytics');
const { calculateStats } = require('../utils/chartGenerator');

exports.getDashboard = async (req, res, next) => {
  try {
    const datasets = Dataset.findByUser(req.user.id);
    res.json({
      message: 'Dashboard data',
      datasetsCount: datasets.length,
      recentDatasets: datasets.slice(0, 5)
    });
  } catch (err) {
    next(err);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const datasets = Dataset.findByUser(req.user.id);
    let totalRows = 0;
    const statsPerDataset = datasets.map(d => {
      totalRows += d.row_count;
      return { id: d.id, name: d.name, rows: d.row_count };
    });
    res.json({
      totalDatasets: datasets.length,
      totalRows,
      datasets: statsPerDataset
    });
  } catch (err) {
    next(err);
  }
};

exports.getWidgetsConfig = (req, res) => {
  // Configuration des widgets (peut être stockée côté utilisateur)
  res.json({
    widgets: [
      { id: 'totalDatasets', type: 'counter', title: 'Total Datasets', size: 'small' },
      { id: 'totalRows', type: 'counter', title: 'Total Rows', size: 'small' },
      { id: 'recentActivity', type: 'list', title: 'Recent Activity', size: 'medium' }
    ]
  });
};