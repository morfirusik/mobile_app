import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import {
  Activity,
  ArrowRight,
  Bell,
  Check,
  ChevronRight,
  CircleHelp,
  Compass,
  Droplets,
  Flag,
  Footprints,
  Gift,
  Heart,
  Home,
  Leaf,
  LogIn,
  MapPin,
  Menu,
  Settings,
  ShieldCheck,
  Sparkles,
  Trophy,
  User,
  Users,
  X,
} from 'lucide-react';
import { AppContext, Badge, Icon, Modal, Scene, type Page } from './ui';
import { loadState, reducer, STORAGE_KEY } from './store';
import { HomeScreen, RoutesScreen, RunScreen, StatisticsScreen } from './screens/Activity';
import { ChallengesScreen, CommunityScreen, CharityScreen } from './screens/Community';
import { HealthScreen, AssistantScreen, ProfileScreen, SettingsScreen } from './screens/Personal';
import { routes } from './data';

const navItems = [
  { id: 'home', icon: Home, ru: 'Главная', kk: 'Басты бет' },
  { id: 'routes', icon: Compass, ru: 'Маршруты', kk: 'Бағыттар' },
  { id: 'statistics', icon: Activity, ru: 'Моя активность', kk: 'Белсенділігім' },
  { id: 'challenges', icon: Trophy, ru: 'Челленджи и рейтинг', kk: 'Челлендждер мен рейтинг' },
  { id: 'health', icon: Heart, ru: 'Здоровье и питание', kk: 'Денсаулық пен тамақтану' },
  { id: 'community', icon: Users, ru: 'Сообщество и партнёры', kk: 'Қауымдастық пен серіктестер' },
  { id: 'charity', icon: Leaf, ru: 'Добрые дела', kk: 'Игі істер' },
  { id: 'assistant', icon: Sparkles, ru: 'ИИ-ассистент', kk: 'ЖИ көмекші' },
] as const;
export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 760px)').matches);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 760px)');
    const update = () => setMobile(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  const [page, setPage] = useState<Page>('home');
  const [menu, setMenu] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [about, setAbout] = useState(false);
  const [routeId, setRouteId] = useState(routes[0].id);
  const [toast, setToast] = useState('');
  const [storageError, setStorageError] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const t = useCallback((ru: string, kk: string) => (state.lang === 'ru' ? ru : kk), [state.lang]);
  const l = useCallback((text: { ru: string; kk: string }) => text[state.lang], [state.lang]);
  const notify = useCallback((message: string) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 4200);
  }, []);
  const navigate = useCallback((p: Page) => {
    setPage(p);
    setMenu(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
    document.documentElement.lang = state.lang;
  }, [state]);
  useEffect(() => () => clearTimeout(toastTimer.current), []);
  const startRun = (id: string) => {
    setRouteId(id);
    navigate('run');
  };
  const closeNotifications = useCallback(() => setNotifications(false), []);
  const closeAbout = useCallback(() => setAbout(false), []);
  const context = { state, dispatch, navigate, notify, t, l };
  const Logo = () => (
    <span className="brand">
      <span className="brand-mark">
        <Footprints size={27} strokeWidth={2} />
      </span>
      <span>
        shymkent
        <span className="brand-run">
          run<span className="brand-dot">.</span>
        </span>
      </span>
    </span>
  );
  if (!state.entered)
    return (
      <AppContext.Provider value={context}>
        <div className="welcome">
          <div className="welcome-visual">
            <Scene />
            <div className="welcome-brand">
              <Logo />
              <Badge>{t('Город в движении', 'Қозғалыстағы қала')}</Badge>
            </div>
            <div className="welcome-visual-copy">
              <span className="eyebrow">SHYMKENT, KAZAKHSTAN</span>
              <h1>
                {t(
                  'Большие перемены\nначинаются с шага.',
                  'Үлкен өзгерістер\nбір қадамнан басталады.',
                )}
              </h1>
            </div>
          </div>
          <div className="welcome-content">
            <div className="welcome-top">
              <Logo />
              <div className="language-switch" aria-label={t('Язык', 'Тіл')}>
                <button
                  className={state.lang === 'ru' ? 'active' : ''}
                  onClick={() => dispatch({ type: 'lang', lang: 'ru' })}
                >
                  РУС
                </button>
                <button
                  className={state.lang === 'kk' ? 'active' : ''}
                  onClick={() => dispatch({ type: 'lang', lang: 'kk' })}
                >
                  ҚАЗ
                </button>
              </div>
            </div>
            <div className="welcome-main">
              <span className="eyebrow">
                <span className="status-dot" />
                {t('ТВОЙ ГОРОД. ТВОЙ РИТМ.', 'СЕНІҢ ҚАЛАҢ. СЕНІҢ ЫРҒАҒЫҢ.')}
              </span>
              <h1>
                {t('Двигайся.\nВдохновляй.\nДелай добро.', 'Қозғал.\nШабыттандыр.\nЖақсылық жаса.')}
              </h1>
              <p>
                {t(
                  'Открывай Шымкент по-новому. Бегай, находи единомышленников и превращай каждый километр в доброе дело.',
                  'Шымкентті жаңаша таны. Жүгір, пікірлес адамдарды тап және әр шақырымды игі іске айналдыр.',
                )}
              </p>
              <div className="welcome-features">
                <span>
                  <Compass size={18} />
                  {t('Маршруты по городу', 'Қала бағыттары')}
                </span>
                <span>
                  <Trophy size={18} />
                  {t('Награды за движение', 'Қозғалыс үшін сыйлықтар')}
                </span>
                <span>
                  <Heart size={18} />
                  {t('Забота о себе и городе', 'Өзіңе және қалаға қамқорлық')}
                </span>
              </div>
              <button
                className="button primary welcome-enter"
                onClick={() => dispatch({ type: 'enter' })}
              >
                {t('Войти в демо', 'Демоға кіру')}
                <ArrowRight size={20} />
              </button>
              <p className="welcome-note">
                <ShieldCheck size={15} />
                {t(
                  'Без регистрации. Данные хранятся в этом браузере.',
                  'Тіркелусіз. Деректер осы браузерде сақталады.',
                )}
              </p>
            </div>
            <div className="welcome-footer">
              <span>© {new Date().getFullYear()} Shymkent Run</span>
              <span>{t('Презентационная версия', 'Презентациялық нұсқа')}</span>
            </div>
          </div>
        </div>
      </AppContext.Provider>
    );
  return (
    <AppContext.Provider value={context}>
      <div className="app-shell">
        {menu && <div className="sidebar-scrim" onClick={() => setMenu(false)} />}
        <aside inert={mobile && !menu} className={`sidebar ${menu ? 'open' : ''}`}>
          <button
            className="brand-button"
            onClick={() => navigate('home')}
            aria-label={t('На главную', 'Басты бетке')}
          >
            <Logo />
          </button>
          <button
            className="icon-button close-menu"
            aria-label={t('Закрыть меню', 'Мәзірді жабу')}
            onClick={() => setMenu(false)}
          >
            <X />
          </button>
          <div className="city-label">
            <MapPin size={14} /> {t('Шымкент, Казахстан', 'Шымкент, Қазақстан')}
          </div>
          <span className="nav-caption">{t('ТВОЁ ПРОСТРАНСТВО', 'СЕНІҢ КЕҢІСТІГІҢ')}</span>
          <nav className="side-nav" aria-label={t('Основная навигация', 'Негізгі навигация')}>
            {navItems.map((n) => (
              <button
                key={n.id}
                className={page === n.id || (page === 'run' && n.id === 'routes') ? 'active' : ''}
                onClick={() => navigate(n.id)}
                aria-current={page === n.id ? 'page' : undefined}
              >
                <n.icon size={20} strokeWidth={1.7} />
                <span>{n[state.lang]}</span>
                {n.id === 'assistant' && (
                  <span className="ai-pill" aria-hidden="true">
                    AI
                  </span>
                )}
              </button>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <div className="sidebar-cause">
              <span className="tiny-leaf">
                <Leaf size={22} />
              </span>
              <strong>{t('Каждый шаг имеет значение', 'Әр қадам маңызды')}</strong>
              <p>{t('Твоя энергия меняет город к лучшему.', 'Сенің қуатың қаланы жақсартады.')}</p>
              <button onClick={() => navigate('charity')}>
                {t('Сделать добро', 'Жақсылық жасау')}
                <ArrowRight size={16} />
              </button>
            </div>
            <button
              className={`sidebar-profile ${page === 'profile' ? 'selected' : ''}`}
              onClick={() => navigate('profile')}
            >
              <span className="avatar">{state.profile.name.slice(0, 1)}</span>
              <span>
                <strong>{state.profile.name}</strong>
                <small>{t('Мой профиль', 'Менің профилім')}</small>
              </span>
              <ChevronRight size={17} />
            </button>
          </div>
        </aside>
        <div className="main-shell">
          <header className="topbar">
            <div className="topbar-location">
              <button
                className="icon-button menu-toggle"
                aria-label={t('Открыть меню', 'Мәзірді ашу')}
                onClick={() => setMenu(true)}
              >
                <Menu size={22} />
              </button>
              <span className="desktop-top-label">
                {t('Маленькие шаги. Большие перемены.', 'Кішкентай қадамдар. Үлкен өзгерістер.')}
              </span>
              <span className="mobile-top-logo">
                shymkent <b>run.</b>
              </span>
            </div>
            <div className="topbar-actions">
              <span className="demo-label">
                <span />
                {t('Демо', 'Демо')}
              </span>
              <div className="language-switch">
                <button
                  aria-label="Русский"
                  className={state.lang === 'ru' ? 'active' : ''}
                  onClick={() => dispatch({ type: 'lang', lang: 'ru' })}
                >
                  РУС
                </button>
                <button
                  aria-label="Қазақша"
                  className={state.lang === 'kk' ? 'active' : ''}
                  onClick={() => dispatch({ type: 'lang', lang: 'kk' })}
                >
                  ҚАЗ
                </button>
              </div>
              <button
                className="icon-button notification-button"
                aria-label={t('Уведомления', 'Хабарламалар')}
                onClick={() => setNotifications(true)}
              >
                <Bell size={20} />
                <i />
              </button>
              <button
                className="avatar top-avatar"
                aria-label={t('Профиль', 'Профиль')}
                onClick={() => navigate('profile')}
              >
                {state.profile.name.slice(0, 1)}
              </button>
            </div>
          </header>
          <main className={`content page-${page}`} id="main-content">
            {storageError && (
              <div className="notice">
                {t(
                  'Браузер запретил сохранение. Данные доступны до закрытия страницы.',
                  'Браузер сақтауға тыйым салды. Деректер бет жабылғанға дейін қолжетімді.',
                )}
              </div>
            )}
            {page === 'home' && <HomeScreen startRun={startRun} />}
            {page === 'routes' && <RoutesScreen startRun={startRun} />}
            <div hidden={page !== 'run'}>
              <RunScreen visible={page === 'run'} routeId={routeId} selectRoute={setRouteId} />
            </div>
            {page === 'statistics' && <StatisticsScreen />}
            {page === 'challenges' && <ChallengesScreen />}
            {page === 'community' && <CommunityScreen />}
            {page === 'charity' && <CharityScreen />}
            {page === 'health' && <HealthScreen />}
            {page === 'assistant' && <AssistantScreen />}
            {page === 'profile' && <ProfileScreen />}
            {page === 'settings' && <SettingsScreen />}
          </main>
          <footer className="app-footer">
            <span>
              Shymkent Run <span>·</span>{' '}
              {t('Бег. Сообщество. Добро.', 'Жүгіру. Қауымдастық. Жақсылық.')}
            </span>
            <button onClick={() => setAbout(true)}>
              <CircleHelp size={14} />
              {t('О проекте', 'Жоба туралы')}
            </button>
          </footer>
        </div>
        <nav className="bottom-nav" aria-label={t('Мобильная навигация', 'Мобильді навигация')}>
          {[
            { id: 'home', icon: Home, ru: 'Главная', kk: 'Басты бет' },
            { id: 'routes', icon: Compass, ru: 'Маршруты', kk: 'Бағыттар' },
            { id: 'community', icon: Users, ru: 'Сообщество', kk: 'Қауымдастық' },
            { id: 'assistant', icon: Sparkles, ru: 'Ассистент', kk: 'Көмекші' },
            { id: 'profile', icon: User, ru: 'Профиль', kk: 'Профиль' },
          ].map((n) => (
            <button
              key={n.id}
              className={page === n.id ? 'active' : ''}
              onClick={() => navigate(n.id as Page)}
            >
              <n.icon size={21} />
              <span>{n[state.lang as 'ru' | 'kk']}</span>
            </button>
          ))}
        </nav>
        {toast && (
          <div className="toast" role="status">
            <Check size={18} />
            {toast}
            <button aria-label={t('Закрыть', 'Жабу')} onClick={() => setToast('')}>
              <X size={16} />
            </button>
          </div>
        )}
        {notifications && (
          <Modal
            title={t('Твой день в движении', 'Қозғалысқа толы күнің')}
            onClose={closeNotifications}
          >
            <div className="notification-list">
              {state.reminder && (
                <button
                  onClick={() => {
                    setNotifications(false);
                    navigate('health');
                  }}
                >
                  <span className="icon-tile blue">
                    <Droplets />
                  </span>
                  <span>
                    <strong>{t('Время для воды', 'Су ішетін уақыт')}</strong>
                    <small>
                      {t(
                        'Сделай небольшой перерыв и отметь стакан воды.',
                        'Кішкене үзіліс жасап, ішкен суыңды белгіле.',
                      )}
                    </small>
                  </span>
                  <ChevronRight size={18} />
                </button>
              )}
              <button
                onClick={() => {
                  setNotifications(false);
                  navigate('challenges');
                }}
              >
                <span className="icon-tile">
                  <Flag />
                </span>
                <span>
                  <strong>{t('Первый шаг к новой привычке', 'Жаңа әдетке алғашқы қадам')}</strong>
                  <small>
                    {t(
                      'Присоединяйся к челленджу и получи 30 баллов.',
                      'Челленджге қосылып, 30 ұпай ал.',
                    )}
                  </small>
                </span>
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="notice">
              {t(
                'Это демонстрационные подсказки внутри приложения.',
                'Бұл қолданба ішіндегі демонстрациялық кеңестер.',
              )}
            </div>
          </Modal>
        )}
        {about && (
          <Modal title="Shymkent Run" onClose={closeAbout}>
            <div className="about-logo">
              <Icon name="foot" size={40} />
            </div>
            <h3>{t('Твой город. Твой ритм.', 'Сенің қалаң. Сенің ырғағың.')}</h3>
            <p>
              {t(
                'Презентационный проект о движении, сообществе и добрых делах в Шымкенте. Тренировки, соперники, купоны и благотворительные проекты показывают возможный опыт будущего приложения.',
                'Шымкенттегі қозғалыс, қауымдастық және игі істер туралы презентациялық жоба. Жаттығулар, қарсыластар, купондар және қайырымдылық жобалары болашақ қолданбаның мүмкіндіктерін көрсетеді.',
              )}
            </p>
            <p>
              {t(
                'Данные сохраняются только в этом браузере. Перевода денег, настоящих скидок и отправки личных данных нет. Карты — условные схемы, не средство навигации.',
                'Деректер тек осы браузерде сақталады. Ақша аудару, нақты жеңілдіктер және жеке деректерді жіберу жоқ. Карталар — навигацияға арналмаған шартты сызбалар.',
              )}
            </p>
            <button className="button primary full" onClick={closeAbout}>
              {t('Продолжить', 'Жалғастыру')}
            </button>
          </Modal>
        )}
      </div>
    </AppContext.Provider>
  );
}
