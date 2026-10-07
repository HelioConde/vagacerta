const supabaseClient = window.IDEIAS_SUPABASE?.client || null;
const STORAGE_KEY = 'vagacerta-applications-v2';
const DOCUMENT_STORAGE_KEY = 'vagacerta-documents-v1';

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

const GATE_TEXT = {
  'pt-BR': {
    followUpEyebrow:'PRÓXIMOS RETORNOS', followUpTitle:'Follow-ups que precisam de atenção',
    followUpHelp:'Conclua ou adie sem perder o histórico da candidatura.',
    calculatedMatch:'Compatibilidade calculada', requirementsTitle:'Compatibilidade explicada por requisito',
    requirementsHint:'Uma linha por requisito: + atendido, - ausente, ? não comprovado. O score é calculado apenas com evidências confirmadas.',
    requirementsPlaceholder:'+ React\n+ HTML/CSS\n- TypeScript\n? Inglês avançado',
    followUpDate:'Data do follow-up', followUpStatus:'Estado do follow-up', pending:'Pendente', completed:'Concluído', postponed:'Adiado',
    interviewPrep:'Preparação de entrevista', interviewQuestions:'Perguntas para treinar', interviewQuestionsPlaceholder:'Uma pergunta por linha',
    reviewPoints:'Pontos para revisar', reviewPointsPlaceholder:'React hooks\nAPIs REST\nProjeto principal', interviewNotes:'Notas da entrevista',
    resumeVersionsEyebrow:'CURRÍCULOS DA CANDIDATURA', resumeVersions:'Versões personalizadas',
    resumeVersionsHelp:'Cada versão fica ligada a esta candidatura e nunca sobrescreve seu currículo-base.',
    versionName:'Nome da versão', resumeContent:'Conteúdo do currículo', saveNewVersion:'Salvar nova versão',
    noFollowUps:'Nenhum follow-up pendente.', dueToday:'vence hoje', overdue:'atrasado', due:'previsto para',
    finish:'Concluir', postpone7:'Adiar 7 dias', resumes:'Currículos', noVersions:'Nenhuma versão personalizada ainda.',
    met:'atendidos', missing:'ausentes', unknown:'não comprovados', evidence:'evidências'
  },
  en: {
    followUpEyebrow:'NEXT FOLLOW-UPS', followUpTitle:'Follow-ups that need attention',
    followUpHelp:'Complete or postpone without losing the application history.',
    calculatedMatch:'Calculated match', requirementsTitle:'Requirement-by-requirement match',
    requirementsHint:'One requirement per line: + met, - missing, ? unverified. The score uses confirmed evidence only.',
    requirementsPlaceholder:'+ React\n+ HTML/CSS\n- TypeScript\n? Advanced English',
    followUpDate:'Follow-up date', followUpStatus:'Follow-up status', pending:'Pending', completed:'Completed', postponed:'Postponed',
    interviewPrep:'Interview preparation', interviewQuestions:'Questions to practice', interviewQuestionsPlaceholder:'One question per line',
    reviewPoints:'Topics to review', reviewPointsPlaceholder:'React hooks\nREST APIs\nMain project', interviewNotes:'Interview notes',
    resumeVersionsEyebrow:'APPLICATION RESUMES', resumeVersions:'Tailored versions',
    resumeVersionsHelp:'Each version is linked to this application and never overwrites your base resume.',
    versionName:'Version name', resumeContent:'Resume content', saveNewVersion:'Save new version',
    noFollowUps:'No pending follow-ups.', dueToday:'due today', overdue:'overdue', due:'due',
    finish:'Complete', postpone7:'Postpone 7 days', resumes:'Resumes', noVersions:'No tailored version yet.',
    met:'met', missing:'missing', unknown:'unverified', evidence:'evidence'
  }
};

function gateTr(key) {
  return GATE_TEXT[currentLang]?.[key] || GATE_TEXT['pt-BR'][key] || key;
}

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
  document.querySelectorAll('[data-vc-i18n]').forEach(element => {
    element.textContent = gateTr(element.dataset.vcI18n);
  });
  document.querySelectorAll('[data-vc-placeholder]').forEach(element => {
    element.placeholder = gateTr(element.dataset.vcPlaceholder);
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
const followUpList = document.querySelector('#follow-up-list');
const documentsDialog = document.querySelector('#documents-dialog');
const documentForm = document.querySelector('#document-form');
const documentList = document.querySelector('#document-list');
const documentsMessage = document.querySelector('#documents-message');

let activeDocumentApplicationId = null;
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

function normalizeRequirements(input) {
  if (typeof input === 'string') return parseRequirementsText(input);
  if (!Array.isArray(input)) return [];
  return input.map(entry => ({
    text: String(entry?.text || '').trim(),
    status: ['met','missing','unknown'].includes(entry?.status) ? entry.status : 'unknown'
  })).filter(entry => entry.text).slice(0, 60);
}

function parseRequirementsText(text) {
  return String(text || '').split(/\n+/).map(line => line.trim()).filter(Boolean).map(line => {
    const prefix = line.charAt(0);
    const status = prefix === '+' ? 'met' : prefix === '-' ? 'missing' : 'unknown';
    const value = ['+','-','?'].includes(prefix) ? line.slice(1).trim() : line;
    return { text: value, status };
  }).filter(entry => entry.text).slice(0, 60);
}

function requirementsToText(items) {
  const prefix = { met: '+', missing: '-', unknown: '?' };
  return normalizeRequirements(items).map(entry => (prefix[entry.status] || '?') + ' ' + entry.text).join('\n');
}

function compatibilitySummary(items) {
  const counts = { met: 0, missing: 0, unknown: 0 };
  normalizeRequirements(items).forEach(entry => counts[entry.status]++);
  const confirmed = counts.met + counts.missing;
  return { ...counts, total: counts.met + counts.missing + counts.unknown, score: confirmed ? Math.round(counts.met / confirmed * 100) : null };
}

function lineList(value) {
  if (Array.isArray(value)) return value.map(x => String(x || '').trim()).filter(Boolean).slice(0, 40);
  return String(value || '').split(/\n+/).map(x => x.trim()).filter(Boolean).slice(0, 40);
}

function normalizeInterviewPrep(value) {
  const raw = value && typeof value === 'object' ? value : {};
  return {
    questions: lineList(raw.questions),
    review: lineList(raw.review),
    notes: String(raw.notes || '').trim()
  };
}

function todayKey() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function addDays(dateKey, days) {
  const base = /^\d{4}-\d{2}-\d{2}$/.test(String(dateKey || '')) ? new Date(dateKey + 'T12:00:00') : new Date();
  base.setDate(base.getDate() + days);
  const local = new Date(base.getTime() - base.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function readLocalDocuments() {
  try {
    const parsed = JSON.parse(localStorage.getItem(DOCUMENT_STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function writeLocalDocuments(items) {
  localStorage.setItem(DOCUMENT_STORAGE_KEY, JSON.stringify(items.slice(0, 100)));
}

function mapDocumentRow(row) {
  return {
    id: row.id,
    applicationId: row.application_id || row.applicationId,
    title: row.title || 'Currículo personalizado',
    content: row.content || '',
    kind: row.kind || 'resume',
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    updatedAt: row.updated_at || row.updatedAt || row.created_at || row.createdAt || new Date().toISOString()
  };
}

function visibleItems() {
  return currentUser ? cloudItems : readLocal();
}

function normalizeLocal(item) {
  const requirements = normalizeRequirements(item.requirements);
  const explained = compatibilitySummary(requirements);
  const legacyScore = item.matchScore === '' || item.matchScore == null ? null : Number(item.matchScore);
  return {
    id: item.id || makeUuid(),
    company: String(item.company || '').trim(),
    role: String(item.role || '').trim(),
    url: String(item.url || '').trim(),
    status: STATUS[item.status] ? item.status : 'saved',
    matchScore: explained.score == null ? (Number.isFinite(legacyScore) ? legacyScore : null) : explained.score,
    requirements,
    salary: String(item.salary || '').trim(),
    notes: String(item.notes || '').trim(),
    followUpAt: /^\d{4}-\d{2}-\d{2}$/.test(String(item.followUpAt || '')) ? String(item.followUpAt) : '',
    followUpStatus: ['pending','completed','postponed'].includes(item.followUpStatus) ? item.followUpStatus : 'pending',
    interviewPrep: normalizeInterviewPrep(item.interviewPrep),
    appliedAt: item.appliedAt || null,
    createdAt: item.createdAt || Date.now(),
    updatedAt: item.updatedAt || Date.now()
  };
}

function mapRow(row) {
  return normalizeLocal({
    id: row.id,
    company: row.company,
    role: row.role,
    url: row.url || '',
    status: STATUS[row.status] ? row.status : 'saved',
    matchScore: row.match_score == null ? null : Number(row.match_score),
    requirements: row.requirements || [],
    salary: row.salary || '',
    notes: row.notes || '',
    followUpAt: row.follow_up_at ? String(row.follow_up_at).slice(0,10) : '',
    followUpStatus: row.follow_up_status || 'pending',
    interviewPrep: row.interview_prep || {},
    appliedAt: row.applied_at,
    createdAt: Date.parse(row.created_at),
    updatedAt: Date.parse(row.updated_at)
  });
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
  const evidence = compatibilitySummary(item.requirements);
  const score = item.matchScore == null || !Number.isFinite(item.matchScore)
    ? '<span class="score neutral">' + tr('noScore') + '</span>'
    : '<span class="score ' + scoreClass(item.matchScore) + '">' + item.matchScore + tr('compatible') + '</span>';
  const evidenceHtml = evidence.total
    ? '<div class="card-evidence"><span class="evidence-chip met">' + evidence.met + ' ' + escapeHtml(gateTr('met')) + '</span><span class="evidence-chip missing">' + evidence.missing + ' ' + escapeHtml(gateTr('missing')) + '</span><span class="evidence-chip unknown">' + evidence.unknown + ' ' + escapeHtml(gateTr('unknown')) + '</span></div>'
    : '';
  const overdue = item.followUpAt && item.followUpStatus === 'pending' && item.followUpAt < todayKey();
  const followHtml = item.followUpAt && item.followUpStatus !== 'completed'
    ? '<span class="follow-chip ' + (overdue ? 'overdue' : '') + '">' + escapeHtml(item.followUpAt) + '</span>' : '';

  return '<article class="job-card" data-id="' + escapeHtml(item.id) + '">' +
    '<div class="card-top"><div><strong>' + escapeHtml(item.role) + '</strong><span>' + escapeHtml(item.company) + '</span></div>' +
    '<button class="icon-button small" type="button" data-edit="' + escapeHtml(item.id) + '" aria-label="Editar candidatura">•••</button></div>' +
    '<div class="card-meta">' + score + followHtml +
    (item.salary ? '<span class="salary">' + escapeHtml(item.salary) + '</span>' : '') + '</div>' +
    evidenceHtml +
    (item.notes ? '<p class="card-notes">' + escapeHtml(item.notes) + '</p>' : '') +
    '<div class="card-tools"><button type="button" data-documents="' + escapeHtml(item.id) + '">' + escapeHtml(gateTr('resumes')) + '</button></div>' +
    '<div class="card-bottom">' +
      '<label><span>Status</span><select data-status="' + escapeHtml(item.id) + '">' +
        Object.entries(STATUS).map(([value, data]) =>
          '<option value="' + value + '"' + (item.status === value ? ' selected' : '') + '>' + escapeHtml(statusText(data, 'short')) + '</option>'
        ).join('') +
      '</select></label>' +
      (href ? '<a href="' + escapeHtml(href) + '" target="_blank" rel="noopener noreferrer">' + tr('openJob') + '</a>' : '') +
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
  renderFollowUps();
}

function renderFollowUps() {
  if (!followUpList) return;
  const items = visibleItems().map(normalizeLocal).filter(item => item.followUpAt && item.followUpStatus !== 'completed').sort((a,b) => a.followUpAt.localeCompare(b.followUpAt));
  if (!items.length) {
    followUpList.innerHTML = '<div class="follow-up-empty">' + escapeHtml(gateTr('noFollowUps')) + '</div>';
    return;
  }
  const today = todayKey();
  followUpList.innerHTML = items.map(item => {
    const isOverdue = item.followUpAt < today;
    const timing = item.followUpAt === today ? gateTr('dueToday') : (isOverdue ? gateTr('overdue') : gateTr('due') + ' ' + item.followUpAt);
    return '<article class="follow-up-item ' + (isOverdue ? 'overdue' : '') + '"><div class="follow-up-copy"><strong>' + escapeHtml(item.role + ' · ' + item.company) + '</strong><span>' + escapeHtml(timing) + '</span></div><div class="follow-up-actions"><button type="button" data-follow-done="' + escapeHtml(item.id) + '">' + escapeHtml(gateTr('finish')) + '</button><button type="button" data-follow-postpone="' + escapeHtml(item.id) + '">' + escapeHtml(gateTr('postpone7')) + '</button></div></article>';
  }).join('');
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
  applicationForm.elements.followUpStatus.value = 'pending';
  applicationForm.elements.matchScore.value = '';
  renderMatchBreakdown([]);
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
  applicationForm.elements.requirements.value = requirementsToText(item.requirements);
  applicationForm.elements.salary.value = item.salary;
  applicationForm.elements.followUpAt.value = item.followUpAt || '';
  applicationForm.elements.followUpStatus.value = item.followUpStatus || 'pending';
  applicationForm.elements.interviewQuestions.value = item.interviewPrep.questions.join('\n');
  applicationForm.elements.interviewReview.value = item.interviewPrep.review.join('\n');
  applicationForm.elements.interviewNotes.value = item.interviewPrep.notes;
  applicationForm.elements.notes.value = item.notes;
  renderMatchBreakdown(item.requirements);
  deleteButton.hidden = false;
  formMessage.textContent = '';
  document.querySelector('#application-title').textContent = 'Editar candidatura';
  applicationDialog.showModal();
}

function renderMatchBreakdown(requirements) {
  const host = document.querySelector('#match-breakdown');
  if (!host) return;
  const summary = compatibilitySummary(requirements);
  applicationForm.elements.matchScore.value = summary.score == null ? '' : summary.score;
  if (!summary.total) {
    host.innerHTML = '';
    return;
  }
  host.innerHTML = '<span class="met">' + summary.met + ' ' + escapeHtml(gateTr('met')) + '</span>' +
    '<span class="missing">' + summary.missing + ' ' + escapeHtml(gateTr('missing')) + '</span>' +
    '<span class="unknown">' + summary.unknown + ' ' + escapeHtml(gateTr('unknown')) + '</span>';
}

function formToItem(existing = null) {
  const values = Object.fromEntries(new FormData(applicationForm));
  const now = Date.now();
  const status = STATUS[values.status] ? values.status : 'saved';
  const requirements = parseRequirementsText(values.requirements);
  const explained = compatibilitySummary(requirements);

  return normalizeLocal({
    ...(existing || {}),
    id: existing?.id || makeUuid(),
    company: values.company,
    role: values.role,
    url: values.url,
    status,
    matchScore: explained.score,
    requirements,
    salary: values.salary,
    notes: values.notes,
    followUpAt: values.followUpAt,
    followUpStatus: values.followUpStatus,
    interviewPrep: {
      questions: lineList(values.interviewQuestions),
      review: lineList(values.interviewReview),
      notes: values.interviewNotes
    },
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
    requirements: item.requirements,
    salary: item.salary || null,
    notes: item.notes,
    follow_up_at: item.followUpAt || null,
    follow_up_status: item.followUpStatus,
    interview_prep: item.interviewPrep,
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

async function documentsForApplication(applicationId) {
  if (currentUser && supabaseClient) {
    const { data, error } = await supabaseClient.from('vagacerta_documents')
      .select('*').eq('application_id', applicationId).eq('kind', 'resume')
      .order('created_at', { ascending: false }).limit(30);
    if (error) throw error;
    return (data || []).map(mapDocumentRow);
  }
  return readLocalDocuments().map(mapDocumentRow).filter(doc => doc.applicationId === applicationId && doc.kind === 'resume')
    .sort((a,b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

async function renderDocuments() {
  if (!activeDocumentApplicationId) return;
  documentsMessage.textContent = '';
  try {
    const docs = await documentsForApplication(activeDocumentApplicationId);
    documentList.innerHTML = docs.length ? docs.map(doc =>
      '<article class="document-version"><header><strong>' + escapeHtml(doc.title) + '</strong><time>' + escapeHtml(new Date(doc.createdAt).toLocaleString(currentLang === 'en' ? 'en-US' : 'pt-BR')) + '</time></header><pre>' + escapeHtml(doc.content) + '</pre></article>'
    ).join('') : '<div class="follow-up-empty">' + escapeHtml(gateTr('noVersions')) + '</div>';
  } catch (error) {
    console.error(error);
    documentList.innerHTML = '';
    documentsMessage.textContent = currentLang === 'en' ? 'Could not load resume versions.' : 'Não foi possível carregar as versões de currículo.';
  }
}

async function openDocuments(applicationId) {
  activeDocumentApplicationId = applicationId;
  documentForm.reset();
  documentsDialog.showModal();
  await renderDocuments();
}

async function saveDocumentVersion(title, content) {
  const doc = {
    id: makeUuid(), applicationId: activeDocumentApplicationId, title: String(title || '').trim(),
    content: String(content || '').trim(), kind: 'resume', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  };
  if (currentUser && supabaseClient) {
    const { error } = await supabaseClient.from('vagacerta_documents').insert({
      id: doc.id, user_id: currentUser.id, application_id: doc.applicationId, kind: doc.kind,
      title: doc.title, content: doc.content, created_at: doc.createdAt, updated_at: doc.updatedAt
    });
    if (error) throw error;
  } else {
    writeLocalDocuments([doc, ...readLocalDocuments()]);
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
  if (edit) { openEdit(edit.dataset.edit); return; }
  const docs = event.target.closest('[data-documents]');
  if (docs) openDocuments(docs.dataset.documents);
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

followUpList?.addEventListener('click', async event => {
  const done = event.target.closest('[data-follow-done]');
  const postpone = event.target.closest('[data-follow-postpone]');
  const id = done?.dataset.followDone || postpone?.dataset.followPostpone;
  if (!id) return;
  const item = visibleItems().map(normalizeLocal).find(entry => entry.id === id);
  if (!item) return;
  if (done) item.followUpStatus = 'completed';
  if (postpone) {
    item.followUpAt = addDays(item.followUpAt, 7);
    item.followUpStatus = 'pending';
  }
  item.updatedAt = Date.now();
  try {
    await persistItem(item);
    showToast(done ? (currentLang === 'en' ? 'Follow-up completed.' : 'Follow-up concluído.') : (currentLang === 'en' ? 'Follow-up postponed.' : 'Follow-up adiado.'));
  } catch (error) {
    console.error(error);
    showToast(currentLang === 'en' ? 'Could not update follow-up.' : 'Não foi possível atualizar o follow-up.');
  }
});

applicationForm.elements.requirements.addEventListener('input', event => {
  renderMatchBreakdown(parseRequirementsText(event.target.value));
});

searchInput.addEventListener('input', renderBoard);
statusFilter.addEventListener('change', renderBoard);

document.querySelector('#documents-close').addEventListener('click', () => documentsDialog.close());
documentsDialog.addEventListener('click', event => { if (event.target === documentsDialog) documentsDialog.close(); });
documentForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!activeDocumentApplicationId || !documentForm.reportValidity()) return;
  const submit = documentForm.querySelector('[type="submit"]');
  submit.disabled = true;
  documentsMessage.textContent = currentLang === 'en' ? 'Saving new version…' : 'Salvando nova versão…';
  try {
    await saveDocumentVersion(documentForm.elements.title.value, documentForm.elements.content.value);
    documentForm.reset();
    documentsMessage.textContent = currentLang === 'en' ? 'New version saved.' : 'Nova versão salva.';
    await renderDocuments();
  } catch (error) {
    console.error(error);
    documentsMessage.textContent = currentLang === 'en' ? 'Could not save this version.' : 'Não foi possível salvar esta versão.';
  } finally {
    submit.disabled = false;
  }
});

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
