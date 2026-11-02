(() => {
  const TOKEN_KEY = 'bao_admin_token';
  const USER_KEY = 'bao_admin_user';
  let token = sessionStorage.getItem(TOKEN_KEY);
  let me = JSON.parse(sessionStorage.getItem(USER_KEY) || 'null');
  let cards = [];
  let activeType = 'all';

  // Libellé, couleur et picto de chaque type de carte (clé = champ "type:" des fichiers Markdown).
  const TYPES = {
    skill: { label: 'Skill', color: '#2F7FD6', bg: '#EAF2FB', icon: '<path d="M12 3l2.4 5.6L20 11l-5.6 2.4L12 19l-2.4-5.6L4 11l5.6-2.4z"/>' },
    agent: { label: 'Agent', color: '#D6712F', bg: '#FBF0EA', icon: '<rect x="5" y="8" width="14" height="11" rx="3"/><line x1="12" y1="4" x2="12" y2="8"/><circle cx="9.5" cy="13.5" r="1"/><circle cx="14.5" cy="13.5" r="1"/>' },
    mcp: { label: 'MCP', color: '#8E44AD', bg: '#F4ECF7', icon: '<path d="M9 7V3M15 7V3"/><rect x="6" y="7" width="12" height="6" rx="2"/><path d="M12 13v3a3 3 0 0 1-3 3H7"/>' },
    tip: { label: 'Tip', color: '#1F8A4C', bg: '#E9F3ED', icon: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.9V16h5v-.2c0-.8.4-1.5 1-1.9A6 6 0 0 0 12 3z"/>' },
    fiche: { label: 'Fiche pratique', color: '#B07A12', bg: '#F7F2E7', icon: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><polyline points="14 3 14 8 19 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/>' },
  };
  const typeOf = (key) => TYPES[key] || TYPES.tip;
  const typeIcon = (key, size = 18) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${typeOf(key).icon}</svg>`;

  const SUITE_URLS = {
    dashboard: 'https://ux-dashboard.onrender.com/login',
    kanban: 'https://trello-collaboratif.onrender.com/admin.html',
    designReview: 'https://wireframe-review.onrender.com/admin',
    tableauBlanc: 'https://tableau-blanc-q5q7.onrender.com/admin',
    administration: 'https://administration-u3wi.onrender.com/login',
    vueProjet: 'https://vue-projet.onrender.com/login',
  };
  [
    ['shToolDashboard', 'dashboard'],
    ['shToolKanban', 'kanban'],
    ['shToolDesignReview', 'designReview'],
    ['shToolTableauBlanc', 'tableauBlanc'],
    ['shToolAdmin', 'administration'],
    ['shToolVueProjet', 'vueProjet'],
  ].forEach(([id, key]) => {
    document.getElementById(id).addEventListener('click', (e) => {
      e.preventDefault();
      shGoToTool('/api/admin/sso-ticket', token, SUITE_URLS[key]);
    });
  });

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function initials(name) {
    return (name || '').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

  function paintAvatar(el, user) {
    if (user.avatarData) {
      el.style.backgroundImage = `url(${user.avatarData})`;
      el.style.backgroundSize = 'cover';
      el.style.backgroundPosition = 'center';
      el.textContent = '';
    } else {
      el.style.backgroundImage = 'none';
      el.style.background = user.avatarColor || '#5b4fe9';
      el.textContent = initials(user.name);
    }
  }

  function renderHeader() {
    if (!me) return;
    paintAvatar(document.getElementById('shHeaderAvatar'), me);
    document.getElementById('shHeaderName').textContent = me.name;
    paintAvatar(document.getElementById('shAccountAvatar'), me);
    document.getElementById('shAccountName').value = me.name;
    document.getElementById('shAccountNote').style.display = me.role === 'superadmin' ? 'none' : '';
  }

  document.getElementById('shAccountAvatarFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const data = await api('POST', '/api/admin/avatar', { dataUri: reader.result });
        me.avatarData = data.avatarData;
        sessionStorage.setItem(USER_KEY, JSON.stringify(me));
        renderHeader();
      } catch (err) {
        alert(err.message);
      } finally {
        e.target.value = '';
      }
    };
    reader.readAsDataURL(file);
  });

  document.getElementById('shLogoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    window.location.href = SUITE_URLS.dashboard + '?loggedOut=1';
  });

  // Un service Render gratuit endormi répond par une page d'erreur HTML (pas du JSON) le temps de
  // se réveiller, ou le fetch échoue tout court.
  function showServiceUnavailable() {
    if (document.getElementById('suiteUnavailableOverlay')) return;
    const el = document.createElement('div');
    el.id = 'suiteUnavailableOverlay';
    el.style.cssText = 'position:fixed;inset:0;background:rgba(26,26,30,.92);color:#fff;display:flex;align-items:center;justify-content:center;font-size:16px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;z-index:99999;text-align:center;padding:24px;';
    el.textContent = 'Connexion au serveur perdue — redirection vers la page de connexion…';
    document.body.appendChild(el);
    setTimeout(() => { window.location.href = SUITE_URLS.dashboard; }, 2500);
  }

  async function api(method, url, body) {
    let res;
    try {
      res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    } catch (err) {
      showServiceUnavailable();
      return new Promise(() => {});
    }
    if (!res.headers.get('content-type')?.includes('application/json')) {
      showServiceUnavailable();
      return new Promise(() => {});
    }
    const data = await res.json();
    if (res.status === 428 && data?.charterRequired) {
      openCharter(false);
      throw new Error(data.error);
    }
    if (res.status === 401 || res.status === 403) {
      sessionStorage.removeItem(TOKEN_KEY);
      token = null;
      showLogin();
      throw new Error(data?.error || 'Session expirée');
    }
    if (!res.ok) throw new Error(data?.error || 'Erreur serveur');
    return data;
  }

  function showLogin() {
    window.location.href = SUITE_URLS.dashboard;
  }

  async function showApp() {
    document.getElementById('ssoLoading').style.display = 'none';
    document.getElementById('app').style.display = '';
    renderHeader();
    charter = await api('GET', '/api/charter');
    if (charter.signedAt) loadContent();
    else openCharter(false);
  }

  async function loadContent() {
    renderCharterLink();
    cards = await api('GET', '/api/cards');
    renderFilters();
    route();
  }

  // ---------- Charte : popin bloquante tant que non signée, relisible ensuite ----------

  let charter = null;
  const charterModal = document.getElementById('charterModal');

  function renderCharterLink() {
    document.getElementById('rereadCharterBtn').textContent = `Relire la charte (signée le ${formatDate(charter.signedAt)})`;
  }

  // readOnly = relecture depuis le lien : on peut fermer, pas de bouton de signature.
  function openCharter(readOnly) {
    if (!charter) return;
    document.getElementById('charterBody').innerHTML = charter.html;
    document.getElementById('charterCloseBtn').style.display = readOnly ? '' : 'none';
    document.getElementById('charterSignBtn').style.display = readOnly ? 'none' : '';
    document.getElementById('charterSigned').textContent = readOnly ? `Signée le ${formatDate(charter.signedAt)}` : '';
    charterModal.dataset.readOnly = readOnly ? '1' : '';
    shOpenModal('charterModal');
  }

  document.getElementById('rereadCharterBtn').addEventListener('click', () => openCharter(true));
  document.getElementById('charterCloseBtn').addEventListener('click', () => shCloseModal('charterModal'));
  charterModal.addEventListener('click', (e) => {
    if (e.target === charterModal && charterModal.dataset.readOnly) shCloseModal('charterModal');
  });
  document.getElementById('charterSignBtn').addEventListener('click', async (e) => {
    e.target.disabled = true;
    try {
      const { signedAt } = await api('POST', '/api/charter/sign');
      charter.signedAt = signedAt;
      shCloseModal('charterModal');
      loadContent();
    } catch (err) {
      alert(err.message);
    } finally {
      e.target.disabled = false;
    }
  });

  // ---------- Navigation : #<slug> ouvre une fiche, sans hash = la liste ----------

  function route() {
    const slug = decodeURIComponent(location.hash.slice(1));
    if (slug) showDetail(slug); else showList();
  }
  window.addEventListener('hashchange', route);

  // ---------- Liste ----------

  function renderFilters() {
    const present = Object.keys(TYPES).filter(key => cards.some(c => c.type === key));
    const btn = (key, label, color) =>
      `<button type="button" class="bao-filter${activeType === key ? ' is-active' : ''}" data-type="${key}" style="--type-color:${color}">${esc(label)}</button>`;
    document.getElementById('filters').innerHTML =
      btn('all', 'Tout', '#1a1a1e') + present.map(key => btn(key, typeOf(key).label, typeOf(key).color)).join('');
  }

  document.getElementById('filters').addEventListener('click', (e) => {
    const b = e.target.closest('.bao-filter');
    if (!b) return;
    activeType = b.dataset.type;
    renderFilters();
    renderGrid();
  });
  document.getElementById('searchInput').addEventListener('input', renderGrid);

  function normalize(s) {
    return (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  }

  function renderGrid() {
    const q = normalize(document.getElementById('searchInput').value.trim());
    const visible = cards.filter(c =>
      (activeType === 'all' || c.type === activeType) &&
      (!q || normalize(`${c.title} ${c.summary} ${typeOf(c.type).label}`).includes(q))
    );
    document.getElementById('cardGrid').innerHTML = visible.map(c => {
      const t = typeOf(c.type);
      return `
        <a class="sh-card bao-card" href="#${encodeURIComponent(c.slug)}" style="--type-color:${t.color}; --type-bg:${t.bg}">
          <div class="bao-card-type"><span class="bao-type-icon">${typeIcon(c.type)}</span>${esc(t.label)}</div>
          <h2 class="bao-card-title">${esc(c.title)}</h2>
          <p class="bao-card-summary">${esc(c.summary)}</p>
        </a>`;
    }).join('');
    document.getElementById('emptyState').style.display = visible.length ? 'none' : '';
  }

  function showList() {
    document.getElementById('detailView').style.display = 'none';
    document.getElementById('listView').style.display = '';
    document.title = 'Boîte à outils IA';
    renderGrid();
  }

  // ---------- Fiche détail ----------

  function formatDate(value) {
    const d = new Date(value);
    return isNaN(d) ? value : d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
    return `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
  }

  async function showDetail(slug) {
    document.getElementById('listView').style.display = 'none';
    document.getElementById('detailView').style.display = '';
    const el = document.getElementById('detail');
    el.innerHTML = '';
    window.scrollTo(0, 0);
    let c;
    try {
      c = await api('GET', `/api/cards/${encodeURIComponent(slug)}`);
    } catch (err) {
      el.innerHTML = `<div class="sh-empty-state">${esc(err.message)}</div>`;
      return;
    }
    const t = typeOf(c.type);
    document.title = `${c.title} — Boîte à outils IA`;
    const glance = [
      ['Objectif', c.objective, t.color],
      ['Domaine d\'intervention', c.domain, '#68686f'],
      ['Atout principal', c.highlight, '#C2417A'],
    ].filter(([, text]) => text);

    // Action principale : le fichier désigné par "fichier:" dans la carte (ex. le skill à télécharger).
    // Les autres pièces jointes et l'export PDF de la fiche passent dans le menu "…".
    const mainFile = c.files.find(f => f.name === c.actionFile);
    const otherFiles = c.files.filter(f => f !== mainFile);
    const downloadIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';

    el.style.setProperty('--type-color', t.color);
    el.style.setProperty('--type-bg', t.bg);
    el.innerHTML = `
      <div class="bao-detail-head">
        <div>
          <div class="bao-detail-type"><span class="bao-type-icon bao-type-icon-lg">${typeIcon(c.type, 24)}</span>${esc(t.label)}</div>
          <h1 class="bao-detail-title">${esc(c.title)}</h1>
        </div>
        <div class="bao-detail-actions">
          ${mainFile ? `<button type="button" class="sh-btn sh-btn-primary" data-file="${esc(mainFile.name)}">${downloadIcon}${esc(c.actionLabel || 'Télécharger')}</button>` : ''}
          <div class="sh-kebab-wrap">
            <button type="button" class="sh-kebab-btn bao-kebab-btn" id="detailKebabBtn" aria-label="Autres actions">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
            </button>
            <div class="sh-dropdown-panel sh-kebab-menu bao-kebab-menu" id="detailKebabMenu">
              <button type="button" data-action="pdf">Télécharger la fiche en PDF</button>
              ${otherFiles.map(f => `<button type="button" data-file="${esc(f.name)}">Télécharger ${esc(f.name)} <span class="bao-menu-size">${formatSize(f.size)}</span></button>`).join('')}
            </div>
          </div>
        </div>
      </div>

      ${glance.length ? `
        <h2 class="bao-section-title">En un coup d'œil</h2>
        <div class="bao-glance">
          ${glance.map(([label, text, color]) => `
            <div class="bao-glance-item" style="--glance-color:${color}">
              <div class="bao-glance-label">${esc(label)}</div>
              <p>${esc(text)}</p>
            </div>`).join('')}
        </div>` : ''}
      <div class="bao-prose">${c.html}</div>

      ${c.updatedAt ? `<p class="bao-updated">Dernière mise à jour le ${esc(formatDate(c.updatedAt))}</p>` : ''}
    `;

    shInitDropdown('detailKebabBtn', 'detailKebabMenu');
    el.querySelectorAll('[data-file]').forEach(btn => btn.addEventListener('click', () => download(c.slug, btn.dataset.file)));
    el.querySelector('[data-action="pdf"]').addEventListener('click', () => exportPdf(c));
  }

  // Export PDF : impression native du navigateur (« Enregistrer au format PDF »), avec une mise en
  // page dédiée (cf. @media print dans app.css). Texte net et sélectionnable, contrairement à une
  // capture d'écran convertie en PDF. Le titre de la page sert de nom de fichier proposé.
  function exportPdf(card) {
    const previousTitle = document.title;
    document.title = card.title;
    window.addEventListener('afterprint', () => { document.title = previousTitle; }, { once: true });
    window.print();
  }

  // Le téléchargement passe par fetch (pour envoyer le jeton), puis un lien temporaire vers le blob.
  async function download(slug, name) {
    const res = await fetch(`/api/cards/${encodeURIComponent(slug)}/files/${encodeURIComponent(name)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) { alert('Téléchargement impossible'); return; }
    const url = URL.createObjectURL(await res.blob());
    const a = Object.assign(document.createElement('a'), { href: url, download: name });
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // ---------- Démarrage : session existante, jeton SSO, ou retour à la connexion de la suite ----------

  const ssoTicket = new URLSearchParams(window.location.search).get('ssoTicket');
  if (ssoTicket) {
    const remaining = new URLSearchParams(window.location.search);
    remaining.delete('ssoTicket');
    const newSearch = remaining.toString();
    history.replaceState(null, '', window.location.pathname + (newSearch ? '?' + newSearch : '') + location.hash);
    document.getElementById('ssoLoading').style.display = 'flex';
    (async () => {
      try {
        const res = await fetch('/api/admin/sso-login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ticket: ssoTicket }) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Jeton invalide ou expiré');
        token = data.token; me = data.user;
        sessionStorage.setItem(TOKEN_KEY, token);
        sessionStorage.setItem(USER_KEY, JSON.stringify(me));
        showApp();
      } catch (err) {
        showLogin();
      }
    })();
  } else if (token && me) {
    showApp();
  } else {
    showLogin();
  }
})();
