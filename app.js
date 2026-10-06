const supabaseClient = window.IDEIAS_SUPABASE?.client || null;
const STORAGE_KEY = 'vagacerta-applications-v2';

let currentLang = localStorage.getItem('vagacerta-lang') === 'en' ? 'en' : 'pt-BR';

const STATUS = {
  saved: { label: { 'pt-BR': 'Salvas', en: 'Saved' }, short: { 'pt-BR': 'Salva', en: 'Saved' } },
  applied: { label: { 'pt-BR': 'Candidatadas', en: 'Applied' }, short: { 'pt-BR': 'Candidatada', en: 'Applied' } },
  interview: { label: { 'pt-BR': 'Entrevistas', en: 'Interviews' }, short: { 'pt-BR': 'Entrevista', en: 'Interview' } },
  offer: { label: { 'pt-BR': 'Propostas', en: 'Offers' }, short: { 'pt-BR': 'Proposta', en: 'Offer' } },
  rejected: { label: { 'pt-BR': 'Encerradas', en: 'Closed' }, short: { 'pt-BR': 'Encerrada', en: 'Closed' } }
};

const TEXT = {
  'pt-BR': {
    local: 'Modo local',
    localOffline: 'Modo local · nuvem indisponível',
    cloud: 'Nuvem',
    account: 'Minha conta',
    login: 'Entrar / sincronizar',
    noScore: 'Sem score',
    compatible: '% compatível',
    openJob: 'Abrir vaga ↗',
    empty: 'Nenhuma candidatura',
    ad: 'Publicidade',
    adCopy: 'Espaço preparado para anúncios não intrusivos.'
  },
  en: {
    local: 'Local mode',
    localOffline: 'Local mode · cloud unavailable',
    cloud: 'Cloud',
    account: 'My account',
    login: 'Sign in / sync',
    noScore: 'No score',
    compatible: '% match',
    openJob: 'Open job ↗',
    empty: 'No applications',
    ad: 'Advertisement',
    adCopy: 'Reserved for non-intrusive ads.'
  }
};

function tr(key) {
  return TEXT[currentLang]?.[key] || TEXT['pt-BR'][key] || key;
}

function statusText(data, type) {
  return data?.[type]?.[currentLang] || data?.[type]?.['pt-BR'] || '';
}

function applyLanguage() {
  document.documentElement.lang = currentLang;
  document.querySelectorAll('[data-lang]').forEach(button => {
    const active = button.dataset.lang === currentLang;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  const ad = document.querySelector('.ad-slot');
  if (ad) {
    ad.setAttribute('aria-label', tr('ad'));
    const [label, copy] = ad.querySelectorAll('span,small');
    if (label) label.textContent = tr('ad');
    if (copy) copy.textContent = tr('adCopy');
  }

  const replacements = currentLang === 'en' ? {
    '.eyebrow': ['APPLICATION TRACKER', 'APPLICATION FUNNEL', 'APPLICATION', 'YOUR ACCOUNT'],
    '.hero h1': 'Miss fewer opportunities.\nMake every next step clear.',
    '.hero-copy': 'Save opportunities, track every stage and quickly see which applications need your attention.',
    '.hero-stat span': 'In progress',
    '.hero-stat small': 'active applications',
    '.search-wrap label': 'Search',
    '#search': 'Company, role or note',
    '.filter-wrap label': 'Status',
    '#new-application': '+ New application',
    '.metrics article:nth-child(1) span': 'Total',
    '.metrics article:nth-child(2) span': 'Applied',
    '.metrics article:nth-child(3) span': 'Interviews',
    '.metrics article:nth-child(4) span': 'Average match',
    '.section-heading h2': 'Where each opportunity stands',
    '.section-heading > p': 'Change the status directly on each card.',
    '.footer small': 'Without an account, data stays on this device. After signing in, it stays private in your account.'
  } : null;

  if (replacements) {
    const eyebrow = document.querySelectorAll('.eyebrow');
    replacements['.eyebrow'].forEach((text, i) => { if (eyebrow[i]) eyebrow[i].textContent = text; });
    document.querySelector('.hero h1').innerHTML = 'Miss fewer opportunities.<br><span>Make every next step clear.</span>';
    document.querySelector('.hero-copy').textContent = replacements['.hero-copy'];
    document.querySelector('.hero-stat span').textContent = replacements['.hero-stat span'];
    document.querySelector('.hero-stat small').textContent = replacements['.hero-stat small'];
    document.querySelector('.search-wrap label').textContent = replacements['.search-wrap label'];
    searchInput.placeholder = replacements['#search'];
    document.querySelector('.filter-wrap label').textContent = replacements['.filter-wrap label'];
    document.querySelector('#new-application').textContent = replacements['#new-application'];
    document.querySelector('.metrics article:nth-child(1) span').textContent = replacements['.metrics article:nth-child(1) span'];
    document.querySelector('.metrics article:nth-child(2) span').textContent = replacements['.metrics article:nth-child(2) span'];
    document.querySelector('.metrics article:nth-child(3) span').textContent = replacements['.metrics article:nth-child(3) span'];
    document.querySelector('.metrics article:nth-child(4) span').textContent = replacements['.metrics article:nth-child(4) span'];
    document.querySelector('.section-heading h2').textContent = replacements['.section-heading h2'];
    document.querySelector('.section-heading > p').textContent = replacements['.section-heading > p'];
    document.querySelector('.footer small').textContent = replacements['.footer small'];
  } else {
    const eyebrow = document.querySelectorAll('.eyebrow');
    ['ORGANIZADOR DE CANDIDATURAS','FUNIL DE CANDIDATURAS','CANDIDATURA','SUA CONTA'].forEach((text,i)=>{if(eyebrow[i]) eyebrow[i].textContent=text;});
    document.querySelector('.hero h1').innerHTML = 'Menos vagas perdidas.<br><span>Mais próximos passos claros.</span>';
    document.querySelector('.hero-copy').textContent = 'Salve oportunidades, acompanhe cada etapa e veja rapidamente quais candidaturas precisam da sua atenção.';
    document.querySelector('.hero-stat span').textContent = 'Em andamento';
    document.querySelector('.hero-stat small').textContent = 'candidaturas ativas';
    document.querySelector('.search-wrap label').textContent = 'Buscar';
    searchInput.placeholder = 'Empresa, cargo ou anotação';
    document.querySelector('.filter-wrap label').textContent = 'Status';
    document.querySelector('#new-application').textContent = '+ Nova candidatura';
    document.querySelector('.metrics article:nth-child(1) span').textContent = 'Total';
    document.querySelector('.metrics article:nth-child(2) span').textContent = 'Candidatadas';
    document.querySelector('.metrics article:nth-child(3) span').textContent = 'Entrevistas';
    document.querySelector('.metrics article:nth-child(4) span').textContent = 'Compatibilidade média';
    document.querySelector('.section-heading h2').textContent = 'Onde cada vaga está agora';
    document.querySelector('.section-heading > p').textContent = 'Altere o status diretamente em cada card.';
    document.querySelector('.footer small').textContent = 'Sem conta, os dados ficam neste dispositivo. Ao entrar, ficam privados na sua conta.';
  }

  accountOpen.textContent = currentUser ? tr('account') : tr('login');
  syncStatus.textContent = currentUser
    ? (loading ? (currentLang === 'en' ? 'Syncing…' : 'Sincronizando…') : tr('cloud') + ' · ' + (currentUser.email || (currentLang === 'en' ? 'connected' : 'conectado')))
    : (supabaseClient ? tr('local') : tr('localOffline'));
  renderBoard();
}

const board = document.querySelector('#board');
const searchInput = document.querySelector('#search');
const statusFilter = document.querySelector('#status-filter');
const applicationDialog = document.querySelector('#application-dialog');
const applicationForm = document.querySelector('#application-form');
const deleteButton = document.querySelector('#delete-application');
const formMessage = document.querySelector('#form-message');
const accountDialog = document.querySelector('#account-dialog');
const accountForm = document.querySelector('#auth-form');
const accountProfile = document.querySelector('#account-profile');
const accountMessage = document.querySelector('#account-message');
const accountOpen = document.querySelector('#account-open');
const syncStatus = document.querySelector('#sync-status');
const importLocalButton = document.querySelector('#import-local');

let currentUser = null;
let cloudItems = [];
let loading = false;

function migrateLegacyLocal() {
  if (localStorage.getItem(STORAGE_KEY)) return;
  try {
    const legacy = JSON.parse(localStorage.getItem('ideias-plus-02-vaga-certa') || '[]');
    if (!Array.isArray(legacy) || !legacy.length) return;
    const migrated = legacy.map(entry => {
      const parts = String(entry.meta || '').split(' · ');
      return normalizeLocal({
        id: makeUuid(),
        company: entry.title || '',
        role: parts[0] || '',
        notes: parts.slice(1).join(' · '),
        status: 'saved',
        createdAt: entry.time || Date.now(),
        updatedAt: entry.time || Date.now()
      });
    }).filter(item => item.company && item.role);
    if (migrated.length) writeLocal(migrated);
  } catch {
    // O protótipo anterior continua intacto se a migração não puder ser lida.
  }
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

function makeUuid() {
  if (crypto.randomUUID) return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')
    .replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');
}

function readLocal() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocal(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 150)));
}

function visibleItems() {
  return currentUser ? cloudItems : readLocal();
}

function normalizeLocal(item) {
  return {
    id: item.id || makeUuid(),
    company: String(item.company || '').trim(),
    role: String(item.role || '').trim(),
    url: String(item.url || '').trim(),
    status: STATUS[item.status] ? item.status : 'saved',
    matchScore: item.matchScore === '' || item.matchScore == null ? null : Number(item.matchScore),
    salary: String(item.salary || '').trim(),
    notes: String(item.notes || '').trim(),
    appliedAt: item.appliedAt || null,
    createdAt: item.createdAt || Date.now(),
    updatedAt: item.updatedAt || Date.now()
  };
}

function mapRow(row) {
  return {
    id: row.id,
    company: row.company,
    role: row.role,
    url: row.url || '',
    status: STATUS[row.status] ? row.status : 'saved',
    matchScore: row.match_score == null ? null : Number(row.match_score),
    salary: row.salary || '',
    notes: row.notes || '',
    appliedAt: row.applied_at,
    createdAt: Date.parse(row.created_at),
    updatedAt: Date.parse(row.updated_at)
  };
}

function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('on');
  window.setTimeout(() => toast.classList.remove('on'), 1900);
}

function filteredItems() {
  const query = searchInput.value.trim().toLocaleLowerCase('pt-BR');
  const status = statusFilter.value;
  return visibleItems()
    .map(normalizeLocal)
    .filter(item => !status || item.status === status)
    .filter(item => {
      if (!query) return true;
      return [item.company, item.role, item.notes, item.salary]
        .some(value => String(value || '').toLocaleLowerCase('pt-BR').includes(query));
    })
    .sort((a, b) => Number(b.updatedAt) - Number(a.updatedAt));
}

function scoreClass(score) {
  if (score == null || !Number.isFinite(score)) return 'neutral';
  if (score >= 80) return 'high';
  if (score >= 60) return 'medium';
  return 'low';
}

function safeHref(url) {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : '';
  } catch {
    return '';
  }
}

function cardHtml(item) {
  const href = safeHref(item.url);
  const score = item.matchScore == null || !Number.isFinite(item.matchScore)
    ? '<span class="score neutral">' + tr('noScore') + '</span>'
    : '<span class="score ' + scoreClass(item.matchScore) + '">' + item.matchScore + tr('compatible') + '</span>';

  return '<article class="job-card" data-id="' + escapeHtml(item.id) + '">' +
    '<div class="card-top"><div><strong>' + escapeHtml(item.role) + '</strong><span>' + escapeHtml(item.company) + '</span></div>' +
    '<button class="icon-button small" type="button" data-edit="' + escapeHtml(item.id) + '" aria-label="Editar candidatura">•••</button></div>' +
    '<div class="card-meta">' + score +
    (item.salary ? '<span class="salary">' + escapeHtml(item.salary) + '</span>' : '') + '</div>' +
    (item.notes ? '<p class="card-notes">' + escapeHtml(item.notes) + '</p>' : '') +
    '<div class="card-bottom">' +
      '<label><span>Status</span><select data-status="' + escapeHtml(item.id) + '">' +
        Object.entries(STATUS).map(([value, data]) =>
          '<option value="' + value + '"' + (item.status === value ? ' selected' : '') + '>' + escapeHtml(statusText(data, 'short')) + '</option>'
        ).join('') +
      '</select></label>' +
      (href ? '<a href="' + escapeHtml(href) + '" target="_blank" rel="noopener noreferrer">" + tr('openJob') + "</a>' : '') +
    '</div>' +
  '</article>';
}

function renderBoard() {
  const items = filteredItems();
  const grouped = Object.fromEntries(Object.keys(STATUS).map(key => [key, []]));
  items.forEach(item => grouped[item.status].push(item));

  board.innerHTML = Object.entries(STATUS).map(([key, data]) =>
    '<section class="column" data-column="' + key + '">' +
      '<header><span>' + escapeHtml(statusText(data, 'label')) + '</span><strong>' + grouped[key].length + '</strong></header>' +
      '<div class="column-list">' +
        (grouped[key].length
          ? grouped[key].map(cardHtml).join('')
          : '<div class="empty-column">' + tr('empty') + '</div>') +
      '</div>' +
    '</section>'
  ).join('');

  renderMetrics();
}

function renderMetrics() {
  const all = visibleItems().map(normalizeLocal);
  const active = all.filter(item => !['rejected', 'offer'].includes(item.status));
  const scores = all.map(item => item.matchScore).filter(score => Number.isFinite(score));
  const average = scores.length ? Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length) : null;

  document.querySelector('#hero-active').textContent = String(active.length);
  document.querySelector('#metric-total').textContent = String(all.length);
  document.querySelector('#metric-applied').textContent = String(all.filter(item => item.status === 'applied').length);
  document.querySelector('#metric-interviews').textContent = String(all.filter(item => item.status === 'interview').length);
  document.querySelector('#metric-score').textContent = average == null ? '—' : average + '%';
}

function resetForm() {
  applicationForm.reset();
  applicationForm.elements.id.value = '';
  applicationForm.elements.status.value = 'saved';
  deleteButton.hidden = true;
  formMessage.textContent = '';
  document.querySelector('#application-title').textContent = 'Adicionar oportunidade';
}

function openNew() {
  resetForm();
  applicationDialog.showModal();
  window.setTimeout(() => applicationForm.elements.company.focus(), 50);
}

function openEdit(id) {
  const item = visibleItems().map(normalizeLocal).find(entry => entry.id === id);
  if (!item) return;

  applicationForm.elements.id.value = item.id;
  applicationForm.elements.company.value = item.company;
  applicationForm.elements.role.value = item.role;
  applicationForm.elements.url.value = item.url;
  applicationForm.elements.status.value = item.status;
  applicationForm.elements.matchScore.value = item.matchScore ?? '';
  applicationForm.elements.salary.value = item.salary;
  applicationForm.elements.notes.value = item.notes;
  deleteButton.hidden = false;
  formMessage.textContent = '';
  document.querySelector('#application-title').textContent = 'Editar candidatura';
  applicationDialog.showModal();
}

function formToItem(existing = null) {
  const values = Object.fromEntries(new FormData(applicationForm));
  const scoreText = String(values.matchScore || '').trim();
  const score = scoreText === '' ? null : Number(scoreText);
  const now = Date.now();
  const status = STATUS[values.status] ? values.status : 'saved';

  return normalizeLocal({
    ...(existing || {}),
    id: existing?.id || makeUuid(),
    company: values.company,
    role: values.role,
    url: values.url,
    status,
    matchScore: Number.isFinite(score) ? Math.min(100, Math.max(0, score)) : null,
    salary: values.salary,
    notes: values.notes,
    appliedAt: existing?.appliedAt || (status !== 'saved' ? new Date(now).toISOString() : null),
    createdAt: existing?.createdAt || now,
    updatedAt: now
  });
}

async function saveCloud(item) {
  const payload = {
    id: item.id,
    user_id: currentUser.id,
    company: item.company,
    role: item.role,
    url: item.url || null,
    status: item.status,
    match_score: item.matchScore,
    salary: item.salary || null,
    notes: item.notes,
    applied_at: item.appliedAt,
    created_at: new Date(item.createdAt).toISOString(),
    updated_at: new Date(item.updatedAt).toISOString()
  };

  const { data, error } = await supabaseClient
    .from('vagacerta_applications')
    .upsert(payload, { onConflict: 'id' })
    .select('*')
    .single();

  if (error) throw error;
  return mapRow(data);
}

async function loadCloud() {
  if (!currentUser || !supabaseClient) return;
  loading = true;
  updateAccountUi();

  const ownerId = currentUser.id;
  const { data, error } = await supabaseClient
    .from('vagacerta_applications')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(150);

  loading = false;
  if (currentUser?.id !== ownerId) return;

  if (error) {
    accountMessage.textContent = 'Não foi possível carregar suas candidaturas.';
    updateAccountUi();
    return;
  }

  cloudItems = (data || []).map(mapRow);
  renderBoard();
  updateAccountUi();
}

async function persistItem(item) {
  if (currentUser && supabaseClient) {
    const saved = await saveCloud(item);
    cloudItems = [saved, ...cloudItems.filter(entry => entry.id !== saved.id)];
  } else {
    const local = readLocal().map(normalizeLocal);
    const index = local.findIndex(entry => entry.id === item.id);
    if (index >= 0) local[index] = item;
    else local.unshift(item);
    writeLocal(local);
  }
  renderBoard();
}

async function removeItem(id) {
  if (currentUser && supabaseClient) {
    const { error } = await supabaseClient.from('vagacerta_applications').delete().eq('id', id);
    if (error) throw error;
    cloudItems = cloudItems.filter(entry => entry.id !== id);
  } else {
    writeLocal(readLocal().map(normalizeLocal).filter(entry => entry.id !== id));
  }
  renderBoard();
}

function authErrorText(error) {
  const message = String(error?.message || '').toLowerCase();
  if (message.includes('invalid login credentials')) return 'E-mail ou senha incorretos.';
  if (message.includes('email not confirmed')) return 'Confirme seu e-mail antes de entrar.';
  if (message.includes('already registered')) return 'Este e-mail já possui conta.';
  if (message.includes('password should be at least')) return 'Use uma senha com pelo menos 8 caracteres.';
  return 'Não foi possível concluir. Confira os dados e tente novamente.';
}

function updateAccountUi() {
  accountOpen.disabled = !supabaseClient;
  accountOpen.textContent = currentUser ? 'Minha conta' : 'Entrar / sincronizar';
  syncStatus.textContent = currentUser
    ? (loading ? 'Sincronizando…' : 'Nuvem · ' + (currentUser.email || 'conectado'))
    : (supabaseClient ? 'Modo local' : 'Modo local · nuvem indisponível');

  accountForm.hidden = Boolean(currentUser) || !supabaseClient;
  accountProfile.hidden = !currentUser;

  if (currentUser) {
    document.querySelector('#account-email').textContent = currentUser.email || 'Conta conectada';
    importLocalButton.hidden = readLocal().length === 0;
  }
}

async function importLocal() {
  if (!currentUser) return;
  const local = readLocal().map(normalizeLocal);
  if (!local.length) {
    importLocalButton.hidden = true;
    return;
  }

  importLocalButton.disabled = true;
  accountMessage.textContent = 'Importando candidaturas deste dispositivo…';

  try {
    for (const raw of local) {
      const item = {
        ...raw,
        id: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(raw.id)
          ? raw.id : makeUuid()
      };
      await saveCloud(item);
    }
    localStorage.removeItem(STORAGE_KEY);
    await loadCloud();
    accountMessage.textContent = 'Importação concluída.';
    importLocalButton.hidden = true;
  } catch (error) {
    console.error(error);
    accountMessage.textContent = 'Não foi possível importar tudo. Os registros locais foram preservados.';
  } finally {
    importLocalButton.disabled = false;
  }
}

document.querySelector('#new-application').addEventListener('click', openNew);
document.querySelector('#application-close').addEventListener('click', () => applicationDialog.close());
document.querySelector('#cancel-application').addEventListener('click', () => applicationDialog.close());
applicationDialog.addEventListener('click', event => {
  if (event.target === applicationDialog) applicationDialog.close();
});

applicationForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!applicationForm.reportValidity()) return;

  const id = applicationForm.elements.id.value;
  const existing = id ? visibleItems().map(normalizeLocal).find(item => item.id === id) : null;
  const item = formToItem(existing || null);
  const submit = applicationForm.querySelector('[type="submit"]');
  submit.disabled = true;
  formMessage.textContent = currentUser ? 'Salvando na nuvem…' : 'Salvando neste dispositivo…';

  try {
    await persistItem(item);
    applicationDialog.close();
    showToast(existing ? 'Candidatura atualizada.' : 'Candidatura adicionada.');
  } catch (error) {
    console.error(error);
    formMessage.textContent = 'Não foi possível salvar. Confira sua conexão e tente novamente.';
  } finally {
    submit.disabled = false;
  }
});

deleteButton.addEventListener('click', async () => {
  const id = applicationForm.elements.id.value;
  if (!id || !window.confirm('Excluir esta candidatura?')) return;
  deleteButton.disabled = true;
  try {
    await removeItem(id);
    applicationDialog.close();
    showToast('Candidatura excluída.');
  } catch (error) {
    console.error(error);
    formMessage.textContent = 'Não foi possível excluir.';
  } finally {
    deleteButton.disabled = false;
  }
});

board.addEventListener('click', event => {
  const edit = event.target.closest('[data-edit]');
  if (edit) openEdit(edit.dataset.edit);
});

board.addEventListener('change', async event => {
  const select = event.target.closest('[data-status]');
  if (!select) return;
  const item = visibleItems().map(normalizeLocal).find(entry => entry.id === select.dataset.status);
  if (!item) return;

  const previous = item.status;
  item.status = select.value;
  item.updatedAt = Date.now();
  if (!item.appliedAt && item.status !== 'saved') item.appliedAt = new Date().toISOString();

  select.disabled = true;
  try {
    await persistItem(item);
    showToast('Status atualizado.');
  } catch (error) {
    console.error(error);
    select.value = previous;
    showToast('Não foi possível atualizar o status.');
  } finally {
    select.disabled = false;
  }
});

searchInput.addEventListener('input', renderBoard);
statusFilter.addEventListener('change', renderBoard);

document.querySelector('#account-close').addEventListener('click', () => accountDialog.close());
accountOpen.addEventListener('click', () => accountDialog.showModal());
accountDialog.addEventListener('click', event => {
  if (event.target === accountDialog) accountDialog.close();
});

accountForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!supabaseClient) return;
  const submit = accountForm.querySelector('[type="submit"]');
  submit.disabled = true;
  accountMessage.textContent = 'Entrando…';
  try {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email: accountForm.elements.email.value.trim(),
      password: accountForm.elements.password.value
    });
    if (error) throw error;
    accountMessage.textContent = 'Conta conectada.';
  } catch (error) {
    accountMessage.textContent = authErrorText(error);
  } finally {
    submit.disabled = false;
  }
});

document.querySelector('#sign-up').addEventListener('click', async () => {
  if (!supabaseClient) return;
  const email = accountForm.elements.email.value.trim();
  const password = accountForm.elements.password.value;
  if (!email || password.length < 8) {
    accountMessage.textContent = 'Informe um e-mail e uma senha com pelo menos 8 caracteres.';
    return;
  }
  const button = document.querySelector('#sign-up');
  button.disabled = true;
  accountMessage.textContent = 'Criando conta…';
  try {
    const { data, error } = await supabaseClient.auth.signUp({ email, password });
    if (error) throw error;
    accountMessage.textContent = data.session
      ? 'Conta criada e conectada.'
      : 'Conta criada. Confirme seu e-mail e depois entre.';
  } catch (error) {
    accountMessage.textContent = authErrorText(error);
  } finally {
    button.disabled = false;
  }
});

document.querySelector('#reset-password').addEventListener('click', async () => {
  if (!supabaseClient) return;
  const email = accountForm.elements.email.value.trim();
  if (!email) {
    accountMessage.textContent = 'Informe seu e-mail primeiro.';
    return;
  }
  try {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.href.split('#')[0]
    });
    if (error) throw error;
    accountMessage.textContent = 'Se o e-mail estiver cadastrado, enviaremos um link de recuperação.';
  } catch (error) {
    accountMessage.textContent = authErrorText(error);
  }
});

document.querySelector('#sign-out').addEventListener('click', async () => {
  if (!supabaseClient) return;
  const { error } = await supabaseClient.auth.signOut();
  accountMessage.textContent = error ? 'Não foi possível sair.' : 'Você saiu da conta.';
});

importLocalButton.addEventListener('click', importLocal);

function initAuth() {
  if (!supabaseClient) {
    updateAccountUi();
    renderBoard();
    return;
  }

  let activeUserId = null;
  const setSession = session => {
    const user = session?.user || null;
    if (user?.id === activeUserId) return;
    activeUserId = user?.id || null;
    currentUser = user;
    cloudItems = [];
    updateAccountUi();
    if (user) window.setTimeout(loadCloud, 0);
    else renderBoard();
  };

  supabaseClient.auth.onAuthStateChange((_event, session) => {
    window.setTimeout(() => setSession(session), 0);
  });

  supabaseClient.auth.getSession().then(({ data, error }) => {
    if (error) {
      accountMessage.textContent = 'Não foi possível verificar sua sessão. O modo local continua disponível.';
      renderBoard();
      return;
    }
    setSession(data.session);
  });
}

migrateLegacyLocal();
renderBoard();
updateAccountUi();
initAuth();


document.querySelectorAll('[data-lang]').forEach(button => {
  button.addEventListener('click', () => {
    currentLang = button.dataset.lang === 'en' ? 'en' : 'pt-BR';
    localStorage.setItem('vagacerta-lang', currentLang);
    applyLanguage();
  });
});
applyLanguage();
