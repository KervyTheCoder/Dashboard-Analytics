// Gestion de l'interface utilisateur et des appels API
document.addEventListener('DOMContentLoaded', () => {
  const authSection = document.getElementById('auth-section');
  const mainContent = document.getElementById('main-content');
  const pageContent = document.getElementById('page-content');
  const navLinks = document.getElementById('nav-links');
  const logoutBtn = document.getElementById('logout-btn');
  const userInfo = document.getElementById('user-info');

  // Vérification auth
  function checkAuth() {
    if (api.token) {
      showApp();
    } else {
      showAuth();
    }
  }

  function showAuth() {
    authSection.style.display = 'block';
    mainContent.style.display = 'none';
    renderAuthForms();
  }

  function showApp() {
    authSection.style.display = 'none';
    mainContent.style.display = 'block';
    loadUserInfo();
    navigateTo('dashboard');
  }

  async function loadUserInfo() {
    try {
      const user = await api.get('/auth/profile');
      userInfo.textContent = `Connecté en tant que ${user.username}`;
    } catch (e) {
      api.clearToken();
      showAuth();
    }
  }

  function renderAuthForms() {
    authSection.innerHTML = `
      <div class="card" style="max-width:400px;margin:2rem auto;">
        <h2>Connexion</h2>
        <form id="login-form">
          <div class="form-group"><label>Email</label><input type="email" name="email" required></div>
          <div class="form-group"><label>Mot de passe</label><input type="password" name="password" required></div>
          <div class="form-actions"><button type="submit" class="btn">Se connecter</button></div>
        </form>
        <hr style="margin:1.5rem 0">
        <h2>Inscription</h2>
        <form id="register-form">
          <div class="form-group"><label>Nom d'utilisateur</label><input type="text" name="username" required></div>
          <div class="form-group"><label>Email</label><input type="email" name="email" required></div>
          <div class="form-group"><label>Mot de passe</label><input type="password" name="password" required></div>
          <div class="form-actions"><button type="submit" class="btn">S'inscrire</button></div>
        </form>
      </div>
    `;
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
  }

  async function handleLogin(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      const data = await api.post('/auth/login', { email, password });
      api.setToken(data.token);
      showApp();
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      const data = await api.post('/auth/register', { username, email, password });
      api.setToken(data.token);
      showApp();
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  }

  logoutBtn.addEventListener('click', () => {
    api.clearToken();
    showAuth();
  });

  // Navigation par onglets
  navLinks.addEventListener('click', (e) => {
    e.preventDefault();
    if (e.target.dataset.page) {
      navigateTo(e.target.dataset.page);
    }
  });

  async function navigateTo(page) {
    // Mise à jour navigation active
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    const activeLink = document.querySelector(`[data-page="${page}"]`);
    if (activeLink) activeLink.classList.add('active');

    switch (page) {
      case 'dashboard': await renderDashboard(); break;
      case 'data': await renderDataPage(); break;
      case 'reports': await renderReportsPage(); break;
      default: pageContent.innerHTML = '<p>Page inconnue</p>';
    }
  }

  async function renderDashboard() {
    pageContent.innerHTML = '<div class="card"><h2>Dashboard</h2><p>Chargement...</p></div>';
    try {
      const stats = await api.get('/dashboard/stats');
      pageContent.innerHTML = `
        <div class="card">
          <h2>Vue d'ensemble</h2>
          <p>Total datasets: <strong>${stats.totalDatasets}</strong></p>
          <p>Total lignes importées: <strong>${stats.totalRows}</strong></p>
        </div>
        <div class="card">
          <h3>Activité récente</h3>
          ${stats.datasets.length ? '<ul>' + stats.datasets.map(d => `<li>${d.name} (${d.rows} lignes)</li>`).join('') + '</ul>' : 'Aucune donnée importée.'}
        </div>
      `;
    } catch (err) {
      pageContent.innerHTML = `<div class="alert alert-error">Erreur: ${err.message}</div>`;
    }
  }

  async function renderDataPage() {
    pageContent.innerHTML = `
      <div class="card">
        <h2>Gestion des données</h2>
        <div style="margin-bottom:1rem">
          <input type="file" id="file-upload" accept=".csv,.json">
          <button id="upload-btn" class="btn">Importer</button>
          <span id="upload-status"></span>
        </div>
        <div id="datasets-list">Chargement...</div>
      </div>
    `;
    document.getElementById('upload-btn').addEventListener('click', handleFileUpload);
    loadDatasetsList();
  }

  async function handleFileUpload() {
    const fileInput = document.getElementById('file-upload');
    const status = document.getElementById('upload-status');
    if (!fileInput.files.length) {
      status.textContent = 'Veuillez choisir un fichier.';
      return;
    }
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    status.textContent = 'Importation...';
    try {
      const result = await api.upload('/data/import', formData);
      status.textContent = result.message;
      loadDatasetsList();
    } catch (err) {
      status.textContent = 'Erreur: ' + err.message;
    }
  }

  async function loadDatasetsList() {
    try {
      const datasets = await api.get('/data');
      const listDiv = document.getElementById('datasets-list');
      if (!datasets.length) {
        listDiv.innerHTML = '<p>Aucun dataset importé.</p>';
        return;
      }
      listDiv.innerHTML = `
        <table>
          <thead><tr><th>Nom</th><th>Type</th><th>Lignes</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            ${datasets.map(d => `
              <tr>
                <td>${d.name}</td>
                <td>${d.file_type}</td>
                <td>${d.row_count}</td>
                <td>${new Date(d.created_at).toLocaleDateString()}</td>
                <td>
                  <button class="btn btn-secondary view-dataset" data-id="${d.id}">Voir</button>
                  <button class="btn btn-danger delete-dataset" data-id="${d.id}">Supprimer</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      // Attacher les événements
      document.querySelectorAll('.delete-dataset').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          if (confirm('Supprimer ce dataset ?')) {
            await api.delete(`/data/${e.target.dataset.id}`);
            loadDatasetsList();
          }
        });
      });
      document.querySelectorAll('.view-dataset').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const id = e.target.dataset.id;
          const dataset = await api.get(`/data/${id}`);
          showDatasetPreview(dataset);
        });
      });
    } catch (err) {
      document.getElementById('datasets-list').innerHTML = `<div class="alert alert-error">${err.message}</div>`;
    }
  }

  function showDatasetPreview(dataset) {
    const previewDiv = document.createElement('div');
    previewDiv.className = 'card';
    previewDiv.innerHTML = `
      <h3>Aperçu: ${dataset.name}</h3>
      <p>Colonnes: ${dataset.columns.join(', ')}</p>
      <div style="max-height:300px;overflow:auto;">
        <table>
          <thead><tr>${dataset.columns.map(c => `<th>${c}</th>`).join('')}</tr></thead>
          <tbody>
            ${dataset.data.slice(0, 20).map(row => `
              <tr>${dataset.columns.map(c => `<td>${row[c] || ''}</td>`).join('')}</tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    const existing = document.querySelector('.dataset-preview');
    if (existing) existing.remove();
    previewDiv.classList.add('dataset-preview');
    pageContent.appendChild(previewDiv);
  }

  async function renderReportsPage() {
    pageContent.innerHTML = `<div class="card"><h2>Rapports</h2><p>Fonctionnalité en cours de développement...</p></div>`;
  }

  // Initialisation
  checkAuth();
});