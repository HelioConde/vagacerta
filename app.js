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
    pageTitle:'VagaCerta — Organizador de candidaturas',
    pageDescription:'Organize candidaturas, acompanhe etapas, compatibilidade e próximos passos da sua busca por emprego.',
    skipLink:'Pular para o conteúdo', heroEyebrow:'ORGANIZADOR DE CANDIDATURAS',
    heroTitleLead:'Menos vagas perdidas.', heroTitleAccent:'Mais próximos passos claros.',
    heroCopy:'Salve oportunidades, acompanhe cada etapa e veja rapidamente quais candidaturas precisam da sua atenção.',
    inProgress:'Em andamento', activeApplications:'candidaturas ativas',
    boardEyebrow:'FUNIL DE CANDIDATURAS', applicationEyebrow:'CANDIDATURA', accountEyebrow:'SUA CONTA',
    close:'Fechar', accountNavLabel:'Conta', languageLabel:'Idioma / Language', filtersLabel:'Filtros de candidaturas',
    summaryLabel:'Resumo', boardNavLabel:'Etapas do funil',
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
    met:'atendidos', missing:'ausentes', unknown:'não comprovados', evidence:'evidências',
    searchLabel:'Buscar', searchPlaceholder:'Empresa, cargo ou anotação', statusLabel:'Status', allStatuses:'Todos',
    statusSavedPlural:'Salvas', statusAppliedPlural:'Candidatadas', statusInterviewPlural:'Entrevistas', statusOfferPlural:'Propostas', statusRejectedPlural:'Encerradas',
    statusSaved:'Salva', statusApplied:'Candidatada', statusInterview:'Entrevista', statusOffer:'Proposta', statusRejected:'Encerrada',
    newApplication:'+ Nova candidatura', metricTotal:'Total', metricApplied:'Candidatadas', metricInterviews:'Entrevistas', metricMatch:'Compatibilidade média',
    boardTitle:'Onde cada vaga está agora', boardHelp:'Altere o status diretamente em cada card.', clearFilters:'Limpar filtros',
    quickStartEyebrow:'COMECE EM 2 MINUTOS', quickStartTitle:'Organize sua próxima candidatura sem planilha.',
    quickStartCopy:'Cadastre a vaga, marque a etapa e deixe o VagaCerta lembrar o próximo passo.', quickStartAction:'Adicionar primeira candidatura',
    quickStep1:'Salve empresa, cargo e link da vaga.', quickStep2:'Marque requisitos e veja a compatibilidade explicada.', quickStep3:'Defina follow-up e acompanhe cada etapa no funil.',
    resultsOne:'1 candidatura exibida', resultsMany:'{count} candidaturas exibidas',
    productivityEyebrow:'RITMO DA BUSCA', productivityTitle:'O que precisa da sua atenção agora', productivityHelp:'Indicadores calculados com suas candidaturas atuais.',
    productivityNew:'Novas em 7 dias', productivityFollowUps:'Follow-ups em 7 dias', productivityAdvanced:'Etapas avançadas', productivityNeedsAction:'Sem próximo passo',
    noAttention:'Nenhuma pendência crítica agora.', attentionOverdue:'Follow-up atrasado', attentionNoNext:'Sem follow-up ou próxima ação definida', attentionStale:'Sem atualização há mais de 7 dias', reviewApplication:'Revisar',
    activityEyebrow:'ATIVIDADE DA CANDIDATURA', activityTitle:'Resumo da atividade', activity:'Atividade', activityCreated:'Oportunidade adicionada', activityApplied:'Candidatura iniciada', activityFollowUp:'Follow-up', activityUpdated:'Última atualização', activityCurrent:'Etapa atual',
    followCompleted:'Concluído', followPending:'Pendente', followPostponed:'Adiado',
    footerPrivacy:'Sem conta, os dados ficam neste dispositivo. Ao entrar, ficam privados na sua conta.',
    addOpportunity:'Adicionar oportunidade', editApplication:'Editar candidatura',
    company:'Empresa', companyPlaceholder:'Ex.: Empresa Aurora', role:'Cargo', rolePlaceholder:'Ex.: Front-End Júnior',
    jobLink:'Link da vaga', salary:'Pretensão / salário', salaryPlaceholder:'Ex.: R$ 2.500 ou a combinar',
    notes:'Próxima ação / anotações', notesPlaceholder:'Ex.: revisar portfólio e fazer follow-up em 5 dias',
    delete:'Excluir', cancel:'Cancelar', saveApplication:'Salvar candidatura',
    syncSearch:'Sincronize sua busca', accountHelp:'Entre para acessar suas candidaturas em outros dispositivos. Seus registros continuam privados por RLS.',
    email:'E-mail', password:'Senha', signIn:'Entrar', signUp:'Criar conta', forgotPassword:'Esqueci a senha',
    connectedAs:'Conectado como', importLocal:'Importar candidaturas deste dispositivo', signOut:'Sair da conta',
    savingCloud:'Salvando na nuvem…', savingLocal:'Salvando neste dispositivo…', updatedApplication:'Candidatura atualizada.',
    addedApplication:'Candidatura adicionada.', saveFailed:'Não foi possível salvar. Confira sua conexão e tente novamente.',
    confirmDelete:'Excluir esta candidatura?', deletedApplication:'Candidatura excluída.', deleteFailed:'Não foi possível excluir.',
    statusUpdated:'Status atualizado.', statusUpdateFailed:'Não foi possível atualizar o status.',
    signingIn:'Entrando…', accountConnected:'Conta conectada.', creatingAccount:'Criando conta…',
    accountCreatedConnected:'Conta criada e conectada.', accountCreatedConfirm:'Conta criada. Confirme seu e-mail e depois entre.',
    emailPasswordRequired:'Informe um e-mail e uma senha com pelo menos 8 caracteres.', emailRequired:'Informe seu e-mail primeiro.',
    resetSent:'Se o e-mail estiver cadastrado, enviaremos um link de recuperação.', signOutFailed:'Não foi possível sair.', signedOut:'Você saiu da conta.',
    invalidCredentials:'E-mail ou senha incorretos.', emailNotConfirmed:'Confirme seu e-mail antes de entrar.', alreadyRegistered:'Este e-mail já possui conta.',
    passwordMin:'Use uma senha com pelo menos 8 caracteres.', authGeneric:'Não foi possível concluir. Confira os dados e tente novamente.',
    requiredCompany:'Informe a empresa.', requiredRole:'Informe o cargo.', invalidUrl:'Informe um link válido, começando com http:// ou https://.',
    invalidEmail:'Informe um e-mail válido.', offlineBanner:'Você está offline. O modo local continua disponível.',
    cloudLoadFailed:'Não foi possível atualizar a nuvem. Seus dados locais continuam disponíveis.',
    syncing:'Sincronizando…', connected:'conectado',
    importingLocal:'Importando candidaturas deste dispositivo…', importComplete:'Importação concluída.',
    importFailed:'Não foi possível importar tudo. Os registros locais foram preservados.',
    resumeLoadFailed:'Não foi possível carregar as versões de currículo.',
    followCompletedToast:'Follow-up concluído.', followPostponedToast:'Follow-up adiado.', followUpdateFailed:'Não foi possível atualizar o follow-up.',
    savingVersion:'Salvando nova versão…', versionSaved:'Nova versão salva.', versionSaveFailed:'Não foi possível salvar esta versão.',
    sessionCheckFailed:'Não foi possível verificar sua sessão. O modo local continua disponível.'
  },
  en: {
    pageTitle:'VagaCerta — Job application tracker',
    pageDescription:'Organize applications, track stages, match and next steps in your job search.',
    skipLink:'Skip to content', heroEyebrow:'APPLICATION TRACKER',
    heroTitleLead:'Miss fewer opportunities.', heroTitleAccent:'Make every next step clear.',
    heroCopy:'Save opportunities, track every stage and quickly see which applications need your attention.',
    inProgress:'In progress', activeApplications:'active applications',
    boardEyebrow:'APPLICATION FUNNEL', applicationEyebrow:'APPLICATION', accountEyebrow:'YOUR ACCOUNT',
    close:'Close', accountNavLabel:'Account', languageLabel:'Language', filtersLabel:'Application filters',
    summaryLabel:'Summary', boardNavLabel:'Funnel stages',
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
    met:'met', missing:'missing', unknown:'unverified', evidence:'evidence',
    searchLabel:'Search', searchPlaceholder:'Company, role or note', statusLabel:'Status', allStatuses:'All',
    statusSavedPlural:'Saved', statusAppliedPlural:'Applied', statusInterviewPlural:'Interviews', statusOfferPlural:'Offers', statusRejectedPlural:'Closed',
    statusSaved:'Saved', statusApplied:'Applied', statusInterview:'Interview', statusOffer:'Offer', statusRejected:'Closed',
    newApplication:'+ New application', metricTotal:'Total', metricApplied:'Applied', metricInterviews:'Interviews', metricMatch:'Average match',
    boardTitle:'Where each opportunity stands', boardHelp:'Change the status directly on each card.', clearFilters:'Clear filters',
    quickStartEyebrow:'START IN 2 MINUTES', quickStartTitle:'Organize your next application without a spreadsheet.',
    quickStartCopy:'Save the job, mark the stage and let VagaCerta keep the next step visible.', quickStartAction:'Add first application',
    quickStep1:'Save company, role and job link.', quickStep2:'Mark requirements and see an explained match score.', quickStep3:'Set a follow-up and track every stage in the funnel.',
    resultsOne:'1 application shown', resultsMany:'{count} applications shown',
    productivityEyebrow:'SEARCH MOMENTUM', productivityTitle:'What needs your attention now', productivityHelp:'Indicators calculated from your current applications.',
    productivityNew:'New in 7 days', productivityFollowUps:'Follow-ups in 7 days', productivityAdvanced:'Advanced stages', productivityNeedsAction:'No next step',
    noAttention:'No critical items right now.', attentionOverdue:'Overdue follow-up', attentionNoNext:'No follow-up or next action defined', attentionStale:'No update for more than 7 days', reviewApplication:'Review',
    activityEyebrow:'APPLICATION ACTIVITY', activityTitle:'Activity summary', activity:'Activity', activityCreated:'Opportunity added', activityApplied:'Application started', activityFollowUp:'Follow-up', activityUpdated:'Last update', activityCurrent:'Current stage',
    followCompleted:'Completed', followPending:'Pending', followPostponed:'Postponed',
    footerPrivacy:'Without an account, data stays on this device. After signing in, it stays private in your account.',
    addOpportunity:'Add opportunity', editApplication:'Edit application',
    company:'Company', companyPlaceholder:'Example: Aurora Company', role:'Role', rolePlaceholder:'Example: Junior Front-End Developer',
    jobLink:'Job link', salary:'Salary / expectation', salaryPlaceholder:'Example: R$ 2,500 or negotiable',
    notes:'Next action / notes', notesPlaceholder:'Example: review portfolio and follow up in 5 days',
    delete:'Delete', cancel:'Cancel', saveApplication:'Save application',
    syncSearch:'Sync your job search', accountHelp:'Sign in to access your applications on other devices. Your records remain private with RLS.',
    email:'Email', password:'Password', signIn:'Sign in', signUp:'Create account', forgotPassword:'Forgot password',
    connectedAs:'Connected as', importLocal:'Import applications from this device', signOut:'Sign out',
    savingCloud:'Saving to cloud…', savingLocal:'Saving on this device…', updatedApplication:'Application updated.',
    addedApplication:'Application added.', saveFailed:'Could not save. Check your connection and try again.',
    confirmDelete:'Delete this application?', deletedApplication:'Application deleted.', deleteFailed:'Could not delete.',
    statusUpdated:'Status updated.', statusUpdateFailed:'Could not update status.',
    signingIn:'Signing in…', accountConnected:'Account connected.', creatingAccount:'Creating account…',
    accountCreatedConnected:'Account created and connected.', accountCreatedConfirm:'Account created. Confirm your email, then sign in.',
    emailPasswordRequired:'Enter an email and a password with at least 8 characters.', emailRequired:'Enter your email first.',
    resetSent:'If the email is registered, we will send a recovery link.', signOutFailed:'Could not sign out.', signedOut:'You signed out.',
    invalidCredentials:'Incorrect email or password.', emailNotConfirmed:'Confirm your email before signing in.', alreadyRegistered:'This email already has an account.',
    passwordMin:'Use a password with at least 8 characters.', authGeneric:'Could not complete the action. Check your details and try again.',
    requiredCompany:'Enter the company.', requiredRole:'Enter the role.', invalidUrl:'Enter a valid link starting with http:// or https://.',
    invalidEmail:'Enter a valid email.', offlineBanner:'You are offline. Local mode is still available.',
    cloudLoadFailed:'Cloud refresh failed. Your local data is still available.',
    syncing:'Syncing…', connected:'connected',
    importingLocal:'Importing applications from this device…', importComplete:'Import complete.',
    importFailed:'Could not import everything. Local records were preserved.',
    resumeLoadFailed:'Could not load resume versions.',
    followCompletedToast:'Follow-up completed.', followPostponedToast:'Follow-up postponed.', followUpdateFailed:'Could not update follow-up.',
    savingVersion:'Saving new version…', versionSaved:'New version saved.', versionSaveFailed:'Could not save this version.',
    sessionCheckFailed:'Could not verify your session. Local mode remains available.'
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
  document.title = gateTr('pageTitle');
  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute('content', gateTr('pageDescription'));

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
  document.querySelectorAll('[data-vc-aria-label]').forEach(element => {
    element.setAttribute('aria-label', gateTr(element.dataset.vcAriaLabel));
  });

  const ad = document.querySelector('.ad-slot');
  if (ad) {
    ad.setAttribute('aria-label', tr('ad'));
    const [label, copy] = ad.querySelectorAll('span,small');
    if (label) label.textContent = tr('ad');
    if (copy) copy.textContent = tr('adCopy');
  }

  document.querySelector('.hero h1').innerHTML = escapeHtml(gateTr('heroTitleLead')) + '<br><span>' + escapeHtml(gateTr('heroTitleAccent')) + '</span>';

  accountOpen.textContent = currentUser ? tr('account') : tr('login');
  syncStatus.textContent = currentUser
    ? (loading ? gateTr('syncing') : tr('cloud') + ' · ' + (currentUser.email || gateTr('connected')))
    : (supabaseClient ? tr('local') : tr('localOffline'));
  renderBoard();
}

const board = document.querySelector('#board');
const boardNav = document.querySelector('#board-nav');
const boardSummary = document.querySelector('#board-summary');
const emptyDashboard = document.querySelector('#empty-dashboard');
const emptyNewApplication = document.querySelector('#empty-new-application');
const clearFiltersButton = document.querySelector('#clear-filters');
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
const connectionBanner = document.querySelector('#connection-banner');
const connectionBannerText = document.querySelector('#connection-banner-text');
const attentionList = document.querySelector('#attention-list');
const activityDialog = document.querySelector('#activity-dialog');
const activitySubtitle = document.querySelector('#activity-subtitle');
const activityTimeline = document.querySelector('#activity-timeline');


function setFieldError(form, name, message, attribute = 'data-field-error') {
  const input = form.elements[name];
  if (!input) return;
  const field = input.closest('.field');
  const error = field?.querySelector('[' + attribute + '="' + name + '"]');
  const active = Boolean(message);
  field?.classList.toggle('has-error', active);
  input.setAttribute('aria-invalid', String(active));
  if (error) error.textContent = message || '';
}

function validateApplicationFields() {
  const company = applicationForm.elements.company.value.trim();
  const role = applicationForm.elements.role.value.trim();
  const url = applicationForm.elements.url.value.trim();

  setFieldError(applicationForm, 'company', company ? '' : gateTr('requiredCompany'));
  setFieldError(applicationForm, 'role', role ? '' : gateTr('requiredRole'));

  let urlMessage = '';
  if (url) {
    try {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol)) urlMessage = gateTr('invalidUrl');
    } catch {
      urlMessage = gateTr('invalidUrl');
    }
  }
  setFieldError(applicationForm, 'url', urlMessage);

  const invalid = applicationForm.querySelector('[aria-invalid="true"]');
  if (invalid) invalid.focus();
  return !invalid;
}

function validateAuthFields() {
  const email = accountForm.elements.email.value.trim();
  const password = accountForm.elements.password.value;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  setFieldError(accountForm, 'email', emailValid ? '' : gateTr('invalidEmail'), 'data-auth-error');
  setFieldError(accountForm, 'password', password.length >= 8 ? '' : gateTr('passwordMin'), 'data-auth-error');
  const invalid = accountForm.querySelector('[aria-invalid="true"]');
  if (invalid) invalid.focus();
  return !invalid;
}

function setBusy(button, busy) {
  if (!button) return;
  button.disabled = busy;
  button.setAttribute('aria-busy', String(busy));
}

function updateConnectivity() {
  if (!connectionBanner || !connectionBannerText) return;
  const offline = !navigator.onLine;
  connectionBanner.hidden = !offline;
  connectionBannerText.textContent = gateTr('offlineBanner');
  document.body.classList.toggle('is-offline', offline);
}

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
    '<button class="icon-button small" type="button" data-edit="' + escapeHtml(item.id) + '" aria-label="' + escapeHtml(gateTr('editApplication')) + '">•••</button></div>' +
    '<div class="card-meta">' + score + followHtml +
    (item.salary ? '<span class="salary">' + escapeHtml(item.salary) + '</span>' : '') + '</div>' +
    evidenceHtml +
    (item.notes ? '<p class="card-notes">' + escapeHtml(item.notes) + '</p>' : '') +
    '<div class="card-tools"><button type="button" data-activity="' + escapeHtml(item.id) + '">' + escapeHtml(gateTr('activity')) + '</button><button type="button" data-documents="' + escapeHtml(item.id) + '">' + escapeHtml(gateTr('resumes')) + '</button></div>' +
    '<div class="card-bottom">' +
      '<label><span>' + escapeHtml(gateTr('statusLabel')) + '</span><select aria-label="' + escapeHtml(gateTr('statusLabel')) + '" data-status="' + escapeHtml(item.id) + '">' +
        Object.entries(STATUS).map(([value, data]) =>
          '<option value="' + value + '"' + (item.status === value ? ' selected' : '') + '>' + escapeHtml(statusText(data, 'short')) + '</option>'
        ).join('') +
      '</select></label>' +
      (href ? '<a href="' + escapeHtml(href) + '" target="_blank" rel="noopener noreferrer">' + tr('openJob') + '</a>' : '') +
    '</div>' +
  '</article>';
}

function renderBoard() {
  const all = visibleItems().map(normalizeLocal);
  const items = filteredItems();
  const grouped = Object.fromEntries(Object.keys(STATUS).map(key => [key, []]));
  items.forEach(item => grouped[item.status].push(item));

  const hasFilters = Boolean(searchInput.value.trim() || statusFilter.value);
  if (emptyDashboard) emptyDashboard.hidden = all.length > 0;
  if (clearFiltersButton) clearFiltersButton.hidden = !hasFilters;
  if (boardSummary) {
    const template = items.length === 1 ? gateTr('resultsOne') : gateTr('resultsMany');
    boardSummary.textContent = template.replace('{count}', String(items.length));
  }

  board.innerHTML = Object.entries(STATUS).map(([key, data]) =>
    '<section class="column" id="column-' + key + '" data-column="' + key + '" tabindex="-1">' +
      '<header><span>' + escapeHtml(statusText(data, 'label')) + '</span><strong>' + grouped[key].length + '</strong></header>' +
      '<div class="column-list">' +
        (grouped[key].length
          ? grouped[key].map(cardHtml).join('')
          : '<div class="empty-column">' + tr('empty') + '</div>') +
      '</div>' +
    '</section>'
  ).join('');

  if (boardNav) {
    boardNav.innerHTML = Object.entries(STATUS).map(([key, data]) =>
      '<button type="button" data-column-jump="' + key + '">' +
        escapeHtml(statusText(data, 'label')) +
        '<span class="count">' + grouped[key].length + '</span>' +
      '</button>'
    ).join('');
  }

  renderMetrics();
  renderProductivity();
  renderFollowUps();
}


function startOfTodayMs() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
}

function formatDateTime(value) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return '';
  return date.toLocaleString(currentLang === 'en' ? 'en-US' : 'pt-BR', {
    dateStyle:'medium', timeStyle:'short'
  });
}

function renderProductivity() {
  const all = visibleItems().map(normalizeLocal);
  const now = Date.now();
  const sevenDays = 7 * 86400000;
  const today = todayKey();
  const nextWeek = addDays(today, 7);

  const recent = all.filter(item => now - Number(item.createdAt) <= sevenDays && now >= Number(item.createdAt)).length;
  const followUps = all.filter(item => item.followUpAt && item.followUpStatus !== 'completed' && item.followUpAt >= today && item.followUpAt <= nextWeek).length;
  const advanced = all.filter(item => ['interview','offer'].includes(item.status)).length;
  const active = all.filter(item => !['rejected','offer'].includes(item.status));
  const needsAction = active.filter(item => !item.followUpAt && !item.notes.trim()).length;

  const set = (selector, value) => {
    const node = document.querySelector(selector);
    if (node) node.textContent = String(value);
  };
  set('#productivity-new', recent);
  set('#productivity-followups', followUps);
  set('#productivity-advanced', advanced);
  set('#productivity-needs-action', needsAction);

  if (!attentionList) return;
  const attention = active.map(item => {
    const overdue = item.followUpAt && item.followUpStatus !== 'completed' && item.followUpAt < today;
    const noNext = !item.followUpAt && !item.notes.trim();
    const stale = now - Number(item.updatedAt) > sevenDays;
    const priority = overdue ? 0 : noNext ? 1 : stale ? 2 : 99;
    const reason = overdue ? gateTr('attentionOverdue') : noNext ? gateTr('attentionNoNext') : stale ? gateTr('attentionStale') : '';
    return { item, priority, reason };
  }).filter(entry => entry.priority < 99)
    .sort((a,b) => a.priority - b.priority || Number(a.item.updatedAt) - Number(b.item.updatedAt))
    .slice(0,5);

  attentionList.innerHTML = attention.length ? attention.map(({item,priority,reason}) =>
    '<article class="attention-item ' + (priority === 0 ? 'priority' : '') + '">' +
      '<div class="attention-copy"><strong>' + escapeHtml(item.role + ' · ' + item.company) + '</strong><span>' + escapeHtml(reason) + '</span></div>' +
      '<button type="button" data-attention-edit="' + escapeHtml(item.id) + '">' + escapeHtml(gateTr('reviewApplication')) + '</button>' +
    '</article>'
  ).join('') : '<div class="follow-up-empty">' + escapeHtml(gateTr('noAttention')) + '</div>';
}

function activityEvents(item) {
  const events = [];
  if (item.createdAt) {
    events.push({ at:Number(item.createdAt), title:gateTr('activityCreated'), detail:item.role + ' · ' + item.company });
  }
  if (item.appliedAt) {
    const appliedMs = Date.parse(item.appliedAt);
    if (Number.isFinite(appliedMs)) events.push({ at:appliedMs, title:gateTr('activityApplied'), detail:statusText(STATUS[item.status], 'short') });
  }
  if (item.followUpAt) {
    const followMs = Date.parse(item.followUpAt + 'T12:00:00');
    const state = item.followUpStatus === 'completed' ? gateTr('followCompleted') : item.followUpStatus === 'postponed' ? gateTr('followPostponed') : gateTr('followPending');
    events.push({ at:followMs, title:gateTr('activityFollowUp'), detail:state });
  }
  if (item.updatedAt && Math.abs(Number(item.updatedAt) - Number(item.createdAt)) > 60000) {
    events.push({ at:Number(item.updatedAt), title:gateTr('activityUpdated'), detail:statusText(STATUS[item.status], 'short') });
  }
  events.push({ at:Date.now() + 1, title:gateTr('activityCurrent'), detail:statusText(STATUS[item.status], 'short'), current:true });
  return events.sort((x,y) => x.at - y.at);
}

function openActivity(id) {
  const item = visibleItems().map(normalizeLocal).find(entry => entry.id === id);
  if (!item || !activityDialog || !activityTimeline) return;
  activitySubtitle.textContent = item.role + ' · ' + item.company;
  activityTimeline.innerHTML = activityEvents(item).map(event =>
    '<li><span class="activity-marker" aria-hidden="true"></span><div class="activity-copy"><strong>' +
      escapeHtml(event.title) + '</strong><span>' + escapeHtml(event.detail) + '</span>' +
      (event.current ? '' : '<time datetime="' + escapeHtml(new Date(event.at).toISOString()) + '">' + escapeHtml(formatDateTime(event.at)) + '</time>') +
    '</div></li>'
  ).join('');
  activityDialog.showModal();
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
  document.querySelector('#application-title').textContent = gateTr('addOpportunity');
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
  document.querySelector('#application-title').textContent = gateTr('editApplication');
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

  let result = await supabaseClient
    .from('vagacerta_applications')
    .upsert(payload, { onConflict: 'id' })
    .select('*')
    .single();

  if (result.error) {
    const message = String(result.error.message || '').toLowerCase();
    const schemaPending = ['requirements','follow_up_at','follow_up_status','interview_prep','schema cache','column']
      .some(token => message.includes(token));

    if (!schemaPending) throw result.error;

    const legacyPayload = {
      id: payload.id,
      user_id: payload.user_id,
      company: payload.company,
      role: payload.role,
      url: payload.url,
      status: payload.status,
      match_score: payload.match_score,
      salary: payload.salary,
      notes: payload.notes,
      applied_at: payload.applied_at,
      created_at: payload.created_at,
      updated_at: payload.updated_at
    };

    result = await supabaseClient
      .from('vagacerta_applications')
      .upsert(legacyPayload, { onConflict: 'id' })
      .select('*')
      .single();

    if (result.error) throw result.error;

    return normalizeLocal({
      ...mapRow(result.data),
      requirements: item.requirements,
      followUpAt: item.followUpAt,
      followUpStatus: item.followUpStatus,
      interviewPrep: item.interviewPrep,
      matchScore: item.matchScore
    });
  }

  return mapRow(result.data);
}

async function loadCloud() {
  if (!currentUser || !supabaseClient) return;
  loading = true;
  document.body.classList.add('is-syncing');
  board.setAttribute('aria-busy', 'true');
  updateAccountUi();

  const ownerId = currentUser.id;
  const { data, error } = await supabaseClient
    .from('vagacerta_applications')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(150);

  loading = false;
  document.body.classList.remove('is-syncing');
  board.setAttribute('aria-busy', 'false');
  if (currentUser?.id !== ownerId) return;

  if (error) {
    accountMessage.textContent = gateTr('cloudLoadFailed');
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
  if (message.includes('invalid login credentials')) return gateTr('invalidCredentials');
  if (message.includes('email not confirmed')) return gateTr('emailNotConfirmed');
  if (message.includes('already registered')) return gateTr('alreadyRegistered');
  if (message.includes('password should be at least')) return gateTr('passwordMin');
  return gateTr('authGeneric');
}

function updateAccountUi() {
  accountOpen.disabled = !supabaseClient;
  accountOpen.textContent = currentUser ? tr('account') : tr('login');
  syncStatus.textContent = currentUser
    ? (loading ? gateTr('syncing') : tr('cloud') + ' · ' + (currentUser.email || gateTr('connected')))
    : (supabaseClient ? tr('local') : tr('localOffline'));

  accountForm.hidden = Boolean(currentUser) || !supabaseClient;
  accountProfile.hidden = !currentUser;

  if (currentUser) {
    document.querySelector('#account-email').textContent = currentUser.email || gateTr('accountConnected');
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
  accountMessage.textContent = gateTr('importingLocal');

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
    accountMessage.textContent = gateTr('importComplete');
    importLocalButton.hidden = true;
  } catch (error) {
    console.error(error);
    accountMessage.textContent = gateTr('importFailed');
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
    documentsMessage.textContent = gateTr('resumeLoadFailed');
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
  if (!validateApplicationFields()) return;

  const id = applicationForm.elements.id.value;
  const existing = id ? visibleItems().map(normalizeLocal).find(item => item.id === id) : null;
  const item = formToItem(existing || null);
  const submit = applicationForm.querySelector('[type="submit"]');
  setBusy(submit, true);
  formMessage.textContent = currentUser ? gateTr('savingCloud') : gateTr('savingLocal');

  try {
    await persistItem(item);
    applicationDialog.close();
    showToast(existing ? gateTr('updatedApplication') : gateTr('addedApplication'));
  } catch (error) {
    console.error(error);
    formMessage.textContent = gateTr('saveFailed');
  } finally {
    setBusy(submit, false);
  }
});

deleteButton.addEventListener('click', async () => {
  const id = applicationForm.elements.id.value;
  if (!id || !window.confirm(gateTr('confirmDelete'))) return;
  deleteButton.disabled = true;
  try {
    await removeItem(id);
    applicationDialog.close();
    showToast(gateTr('deletedApplication'));
  } catch (error) {
    console.error(error);
    formMessage.textContent = gateTr('deleteFailed');
  } finally {
    deleteButton.disabled = false;
  }
});

board.addEventListener('click', event => {
  const edit = event.target.closest('[data-edit]');
  if (edit) { openEdit(edit.dataset.edit); return; }
  const activity = event.target.closest('[data-activity]');
  if (activity) { openActivity(activity.dataset.activity); return; }
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
    showToast(gateTr('statusUpdated'));
  } catch (error) {
    console.error(error);
    select.value = previous;
    showToast(gateTr('statusUpdateFailed'));
  } finally {
    select.disabled = false;
  }
});

attentionList?.addEventListener('click', event => {
  const button = event.target.closest('[data-attention-edit]');
  if (button) openEdit(button.dataset.attentionEdit);
});
document.querySelector('#activity-close')?.addEventListener('click', () => activityDialog.close());
activityDialog?.addEventListener('click', event => { if (event.target === activityDialog) activityDialog.close(); });

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
    showToast(done ? gateTr('followCompletedToast') : gateTr('followPostponedToast'));
  } catch (error) {
    console.error(error);
    showToast(gateTr('followUpdateFailed'));
  }
});

applicationForm.elements.requirements.addEventListener('input', event => {
  renderMatchBreakdown(parseRequirementsText(event.target.value));
});
['company','role','url'].forEach(name => {
  applicationForm.elements[name]?.addEventListener('input', () => setFieldError(applicationForm, name, '', 'data-field-error'));
});
['email','password'].forEach(name => {
  accountForm.elements[name]?.addEventListener('input', () => setFieldError(accountForm, name, '', 'data-auth-error'));
});

searchInput.addEventListener('input', renderBoard);
statusFilter.addEventListener('change', renderBoard);
clearFiltersButton?.addEventListener('click', () => {
  searchInput.value = '';
  statusFilter.value = '';
  renderBoard();
  searchInput.focus();
});
emptyNewApplication?.addEventListener('click', openNew);
boardNav?.addEventListener('click', event => {
  const button = event.target.closest('[data-column-jump]');
  if (!button) return;
  const column = document.querySelector('#column-' + button.dataset.columnJump);
  column?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  window.setTimeout(() => column?.focus({ preventScroll: true }), 220);
});

document.querySelector('#documents-close').addEventListener('click', () => documentsDialog.close());
documentsDialog.addEventListener('click', event => { if (event.target === documentsDialog) documentsDialog.close(); });
documentForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!activeDocumentApplicationId || !documentForm.reportValidity()) return;
  const submit = documentForm.querySelector('[type="submit"]');
  submit.disabled = true;
  documentsMessage.textContent = gateTr('savingVersion');
  try {
    await saveDocumentVersion(documentForm.elements.title.value, documentForm.elements.content.value);
    documentForm.reset();
    documentsMessage.textContent = gateTr('versionSaved');
    await renderDocuments();
  } catch (error) {
    console.error(error);
    documentsMessage.textContent = gateTr('versionSaveFailed');
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
  if (!supabaseClient || !validateAuthFields()) return;
  const submit = accountForm.querySelector('[type="submit"]');
  setBusy(submit, true);
  accountMessage.textContent = gateTr('signingIn');
  try {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email: accountForm.elements.email.value.trim(),
      password: accountForm.elements.password.value
    });
    if (error) throw error;
    accountMessage.textContent = gateTr('accountConnected');
  } catch (error) {
    accountMessage.textContent = authErrorText(error);
  } finally {
    setBusy(submit, false);
  }
});

document.querySelector('#sign-up').addEventListener('click', async () => {
  if (!supabaseClient) return;
  const email = accountForm.elements.email.value.trim();
  const password = accountForm.elements.password.value;
  if (!validateAuthFields()) {
    accountMessage.textContent = gateTr('emailPasswordRequired');
    return;
  }
  const button = document.querySelector('#sign-up');
  setBusy(button, true);
  accountMessage.textContent = gateTr('creatingAccount');
  try {
    const { data, error } = await supabaseClient.auth.signUp({ email, password });
    if (error) throw error;
    accountMessage.textContent = data.session
      ? gateTr('accountCreatedConnected')
      : gateTr('accountCreatedConfirm');
  } catch (error) {
    accountMessage.textContent = authErrorText(error);
  } finally {
    setBusy(button, false);
  }
});

document.querySelector('#reset-password').addEventListener('click', async () => {
  if (!supabaseClient) return;
  const email = accountForm.elements.email.value.trim();
  if (!email) {
    accountMessage.textContent = gateTr('emailRequired');
    return;
  }
  try {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.href.split('#')[0]
    });
    if (error) throw error;
    accountMessage.textContent = gateTr('resetSent');
  } catch (error) {
    accountMessage.textContent = authErrorText(error);
  }
});

document.querySelector('#sign-out').addEventListener('click', async () => {
  if (!supabaseClient) return;
  const { error } = await supabaseClient.auth.signOut();
  accountMessage.textContent = error ? gateTr('signOutFailed') : gateTr('signedOut');
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
      accountMessage.textContent = gateTr('sessionCheckFailed');
      renderBoard();
      return;
    }
    setSession(data.session);
  });
}

window.addEventListener('online', updateConnectivity);
window.addEventListener('offline', updateConnectivity);

migrateLegacyLocal();
renderBoard();
updateAccountUi();
updateConnectivity();
initAuth();


document.querySelectorAll('[data-lang]').forEach(button => {
  button.addEventListener('click', () => {
    currentLang = button.dataset.lang === 'en' ? 'en' : 'pt-BR';
    localStorage.setItem('vagacerta-lang', currentLang);
    applyLanguage();
    updateConnectivity();
  });
});
applyLanguage();
updateConnectivity();
