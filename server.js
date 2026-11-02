require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const { marked } = require('marked');

function requireSecret(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`\n❌ La variable d'environnement ${name} est obligatoire (voir .env.example). Arrêt du serveur.\n`);
    process.exit(1);
  }
  return value;
}

const app = express();
const PORT = process.env.PORT || 3070;
const JWT_SECRET = requireSecret('JWT_SECRET');
const TOOL_KEY = 'boite-a-outils';

// Identité centralisée : la connexion est vérifiée auprès d'Administration.
const ADMINISTRATION_URL = requireSecret('ADMINISTRATION_URL').replace(/\/+$/, '');
const INTERNAL_API_SECRET = requireSecret('INTERNAL_API_SECRET');

// Pas de base de données : le contenu (cartes) vit dans des fichiers Markdown versionnés dans le
// dépôt (dossier content/), et les pièces jointes téléchargeables dans content/files/<slug>/.
// Ajouter une carte = ajouter un fichier .md puis pousser : Render redéploie tout seul.
const CONTENT_DIR = path.join(__dirname, 'content');
const FILES_DIR = path.join(CONTENT_DIR, 'files');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Sur le plan gratuit Render, Administration peut mettre 20-30s à se réveiller et répondre par une
// page d'erreur HTML pendant ce laps de temps : on retente quelques fois avant d'abandonner.
async function callAdministration(apiPath, options = {}, attempt = 0) {
  const MAX_ATTEMPTS = 4;
  let res;
  try {
    res = await fetch(`${ADMINISTRATION_URL}${apiPath}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', 'x-internal-secret': INTERNAL_API_SECRET, ...(options.headers || {}) },
    });
  } catch (err) {
    if (attempt + 1 < MAX_ATTEMPTS) { await sleep(2000 * (attempt + 1)); return callAdministration(apiPath, options, attempt + 1); }
    throw err;
  }
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    if (attempt + 1 < MAX_ATTEMPTS) { await sleep(2000 * (attempt + 1)); return callAdministration(apiPath, options, attempt + 1); }
    throw new Error(`Réponse inattendue d'Administration (${res.status}) sur ${apiPath} : ${(await res.text()).slice(0, 200)}`);
  }
  return res.json();
}

// ---------- Contenu (fichiers Markdown) ----------

// En-tête minimal "clé: valeur" entre deux lignes "---" (pas de YAML complet : une valeur par ligne,
// tout ce qui suit le premier ":" est la valeur, ce qui autorise des ":" dans les textes).
function parseCard(slug, raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  const meta = {};
  let body = raw;
  if (match) {
    body = match[2];
    for (const line of match[1].split(/\r?\n/)) {
      const i = line.indexOf(':');
      if (i === -1) continue;
      meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
  }
  return {
    slug,
    type: (meta.type || 'tip').toLowerCase(),
    title: meta.titre || slug,
    summary: meta.resume || '',
    status: meta.statut || '',
    audience: meta.cible || '',
    objective: meta.objectif || '',
    domain: meta.domaine || '',
    highlight: meta.atout || '',
    updatedAt: meta.maj || '',
    order: Number(meta.ordre) || 999,
    body,
  };
}

function listFiles(slug) {
  const dir = path.join(FILES_DIR, slug);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(name => !name.startsWith('.'))
    .map(name => ({ name, size: fs.statSync(path.join(dir, name)).size }));
}

// Relu à chaque requête (quelques fichiers, négligeable) : une carte ajoutée ou modifiée en local
// apparaît sans redémarrer le serveur.
function loadCards() {
  return fs.readdirSync(CONTENT_DIR)
    .filter(name => name.endsWith('.md'))
    .map(name => parseCard(name.replace(/\.md$/, ''), fs.readFileSync(path.join(CONTENT_DIR, name), 'utf8')))
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'fr'));
}

function findCard(slug) {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const file = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  return parseCard(slug, fs.readFileSync(file, 'utf8'));
}

// ---------- Auth ----------

app.use(express.json({ limit: '5mb' }));
app.use(express.static('public'));

const ah = fn => (req, res, next) => fn(req, res, next).catch(next);

function adminAuth(req, res, next) {
  const token = (req.headers.authorization || '').split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Non autorisé' });
  try {
    const d = jwt.verify(token, JWT_SECRET);
    if (!d.sub) return res.status(403).json({ error: 'Accès refusé' });
    req.user = d; next();
  } catch { res.status(401).json({ error: 'Token invalide' }); }
}

function signSessionFor(user) {
  const token = jwt.sign(
    { sub: user.id, name: user.name, role: user.role, avatarColor: user.avatarColor },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
  return { token, user: { id: user.id, name: user.name, role: user.role, avatarColor: user.avatarColor, avatarData: user.avatarData } };
}

const NO_ACCESS = "Tu n'as pas accès à la Boîte à outils IA. Contacte le superadmin.";

app.post('/api/admin/login', ah(async (req, res) => {
  const { login, password } = req.body || {};
  if (!login?.trim() || !password) return res.status(400).json({ error: 'Identifiant et mot de passe requis' });
  const result = await callAdministration('/internal/verify-credentials', {
    method: 'POST',
    body: JSON.stringify({ login: login.trim(), password }),
  });
  if (!result.valid) return res.status(401).json({ error: 'Identifiant ou mot de passe incorrect' });
  if (!result.user.permissions[TOOL_KEY]) return res.status(403).json({ error: NO_ACCESS });
  res.json(signSessionFor(result.user));
}));

// SSO : demande un jeton de transfert court (drawer "Nos outils" → autre outil de la suite).
app.post('/api/admin/sso-ticket', adminAuth, ah(async (req, res) => {
  const result = await callAdministration('/internal/sso-ticket', {
    method: 'POST',
    body: JSON.stringify({ userId: req.user.sub }),
  });
  res.json(result);
}));

// SSO : reçoit un jeton de transfert émis par un autre outil et ouvre une session locale.
app.post('/api/admin/sso-login', ah(async (req, res) => {
  const { ticket } = req.body || {};
  if (!ticket) return res.status(400).json({ error: 'Jeton requis' });
  const result = await callAdministration('/internal/verify-sso-ticket', {
    method: 'POST',
    body: JSON.stringify({ ticket }),
  });
  if (!result.valid) return res.status(401).json({ error: 'Jeton invalide ou expiré' });
  if (!result.user.permissions[TOOL_KEY]) return res.status(403).json({ error: NO_ACCESS });
  res.json(signSessionFor(result.user));
}));

// Photo de profil : proxy vers Administration (source de vérité du profil utilisateur).
app.post('/api/admin/avatar', adminAuth, ah(async (req, res) => {
  const result = await callAdministration(`/internal/users/${req.user.sub}/avatar`, {
    method: 'POST',
    body: JSON.stringify({ dataUri: req.body?.dataUri }),
  });
  if (result.error) return res.status(400).json(result);
  res.json(result);
}));

// ---------- Cartes ----------

app.get('/api/cards', adminAuth, (req, res) => {
  res.json(loadCards().map(({ body, ...card }) => card));
});

app.get('/api/cards/:slug', adminAuth, (req, res) => {
  const card = findCard(req.params.slug);
  if (!card) return res.status(404).json({ error: 'Fiche introuvable' });
  const { body, ...rest } = card;
  res.json({ ...rest, html: marked.parse(body), files: listFiles(card.slug) });
});

// Téléchargement d'une pièce jointe : on ne sert que les noms réellement présents dans le dossier
// de la carte (jamais un chemin construit à partir de la requête), pour exclure tout "../".
app.get('/api/cards/:slug/files/:name', adminAuth, (req, res) => {
  const card = findCard(req.params.slug);
  if (!card) return res.status(404).json({ error: 'Fiche introuvable' });
  const file = listFiles(card.slug).find(f => f.name === req.params.name);
  if (!file) return res.status(404).json({ error: 'Fichier introuvable' });
  res.download(path.join(FILES_DIR, card.slug, file.name));
});

// ---------- Pages ----------

app.get('/', (req, res) => res.redirect('/admin'));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erreur serveur' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Boîte à outils IA démarrée sur http://localhost:${PORT}/admin\n`);
});
