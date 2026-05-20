const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { initDatabase } = require('./utils/database');
const errorHandler = require('./middleware/errorHandler');

// Création des dossiers nécessaires
['uploads', 'reports', 'data'].forEach(dir => {
  if (!fs.existsSync(path.join(__dirname, '..', dir))) {
    fs.mkdirSync(path.join(__dirname, '..', dir), { recursive: true });
  }
});

const app = express();

// Middleware global
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Initialisation base de données
initDatabase();

// Routes API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/data', require('./routes/dataRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// Page d'accueil (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Gestionnaire d'erreurs
app.use(errorHandler);

module.exports = app;