import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  ChevronRight,
  Clock3,
  Compass,
  Droplets,
  Flag,
  Flame,
  Footprints,
  Gift,
  Heart,
  Leaf,
  MapPin,
  Medal,
  Pause,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  Square,
  Target,
  Timer,
  TrendingUp,
  Trophy,
  X,
} from 'lucide-react';
import { activityNames, routes, type Route } from '../data';
import { dateKey, totalKm, type Run } from '../store';
import {
  Achievement,
  Badge,
  BackButton,
  Empty,
  Modal,
  PageHeading,
  Progress,
  RouteMap,
  Scene,
  SectionTitle,
  useApp,
} from '../ui';

const number = (value: number, lang: string, digits = 1) =>
  value.toLocaleString(lang === 'ru' ? 'ru-RU' : 'kk-KZ', { maximumFractionDigits: digits });
export function formatTime(s: number) {
  const total = Math.floor(s);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}
export function HomeScreen({ startRun }: { startRun: (id: string) => void }) {
  const { state, t, l, navigate, dispatch } = useApp();
  const total = totalKm(state);
  const weekly = state.runs
    .filter((r) => Date.now() - new Date(r.date).getTime() < 7 * 86400000)
    .reduce((sum, r) => sum + r.distance, 0);
  const water = state.water.date === dateKey() ? state.water.ml : 0;
  return (
    <>
      <div className="greeting">
        <div>
          <div className="eyebrow greeting-date">
            <span className="status-dot" />
            {t('ХОРОШИЙ ДЕНЬ ДЛЯ ДВИЖЕНИЯ', 'ҚОЗҒАЛЫС ҮШІН КЕРЕМЕТ КҮН')}
          </div>
          <h1>
            {t('Привет', 'Сәлем')}, {state.profile.name.split(' ')[0]}{' '}
            <span className="wave">☀</span>
          </h1>
          <p>
            {t(
              'Твой следующий шаг — к лучшей версии себя.',
              'Келесі қадамың — өзіңнің үздік нұсқаңа қарай.',
            )}
          </p>
        </div>
        <button className="date-chip" onClick={() => navigate('statistics')}>
          <span>
            {new Date().toLocaleDateString(state.lang === 'ru' ? 'ru-RU' : 'kk-KZ', {
              day: 'numeric',
              month: 'long',
            })}
          </span>
          <span>
            {new Date().toLocaleDateString(state.lang === 'ru' ? 'ru-RU' : 'kk-KZ', {
              weekday: 'long',
            })}
          </span>
        </button>
      </div>
      <div className="home-grid">
        <div className="home-main">
          <section className="hero-card">
            <Scene />
            <div className="hero-shade" />
            <div className="hero-copy">
              <span className="hero-label">
                <MapPin size={13} />
                {t('ОТКРЫВАЙ ШЫМКЕНТ', 'ШЫМКЕНТТІ ТАНЫ')}
              </span>
              <h2>{t('Твой город.\nТвой ритм.', 'Сенің қалаң.\nСенің ырғағың.')}</h2>
              <p>
                {t(
                  'Каждый километр —\nмаленькая победа и большое добро.',
                  'Әр шақырым —\nкішкентай жеңіс пен үлкен жақсылық.',
                )}
              </p>
              <button className="button cream" onClick={() => startRun(routes[0].id)}>
                <Play size={17} fill="currentColor" />
                {t('Начать тренировку', 'Жаттығуды бастау')}
                <ArrowRight size={17} />
              </button>
            </div>
            <span className="hero-bottom">
              <span />
              {t('Бегаем вместе. Меняем город.', 'Бірге жүгіреміз. Қаланы өзгертеміз.')}
            </span>
          </section>
          <div className="stats-row">
            <button className="stat-card" onClick={() => navigate('statistics')}>
              <span className="stat-icon">
                <Footprints size={20} />
              </span>
              <span className="stat-label">{t('За эту неделю', 'Осы аптада')}</span>
              <strong>
                {number(weekly, state.lang)} <small>{t('км', 'км')}</small>
              </strong>
              <span className="stat-caption">
                <TrendingUp size={13} />
                {t('Каждый шаг в зачёт', 'Әр қадам есепте')}
              </span>
            </button>
            <button className="stat-card" onClick={() => navigate('community')}>
              <span className="stat-icon sand">
                <Sparkles size={20} />
              </span>
              <span className="stat-label">{t('Твой баланс', 'Ұпайларың')}</span>
              <strong>
                {state.balance} <small>{t('баллов', 'ұпай')}</small>
              </strong>
              <span className="stat-caption muted">
                {t('Обменяй на что-то хорошее', 'Жақсылыққа айырбаста')}
              </span>
            </button>
            <button className="stat-card" onClick={() => navigate('statistics')}>
              <span className="stat-icon peach">
                <Flame size={20} />
              </span>
              <span className="stat-label">{t('Тренировки', 'Жаттығулар')}</span>
              <strong>
                {state.runs.length} <small>{t('всего', 'барлығы')}</small>
              </strong>
              <span className="stat-caption muted">
                {t('Хорошее начало привычки', 'Жақсы әдеттің бастауы')}
              </span>
            </button>
          </div>
          <SectionTitle
            title={t('Открой свой маршрут', 'Өз бағытыңды тап')}
            action={t('Все маршруты', 'Барлық бағыттар')}
            onClick={() => navigate('routes')}
          />
          <div className="home-route-grid">
            {routes.slice(0, 2).map((r) => (
              <button className="route-mini" key={r.id} onClick={() => startRun(r.id)}>
                <div className="route-mini-art">
                  <Scene variant={r.art} />
                  <Badge>
                    <Footprints size={12} />
                    {r.distance} {t('км', 'км')}
                  </Badge>
                </div>
                <div className="route-mini-copy">
                  <div>
                    <h3>{l(r.name)}</h3>
                    <span>
                      <MapPin size={12} />
                      {t('Шымкент', 'Шымкент')}
                      <i /> {l(r.level)}
                    </span>
                  </div>
                  <span className="round-arrow">
                    <ArrowRight size={17} />
                  </span>
                </div>
              </button>
            ))}
          </div>
          <button className="good-banner" onClick={() => navigate('charity')}>
            <span className="good-icon">
              <Heart size={25} />
            </span>
            <span>
              <span className="eyebrow">{t('БОЛЬШЕ, ЧЕМ СПОРТ', 'СПОРТТАН ДА МАҢЫЗДЫ')}</span>
              <strong>{t('Твои километры могут помочь', 'Сенің шақырымдарың көмектеседі')}</strong>
              <small>
                {t(
                  'Направляй баллы на добрые дела города',
                  'Ұпайларыңды қаланың игі істеріне арна',
                )}
              </small>
            </span>
            <ArrowRight size={23} />
          </button>
        </div>
        <aside className="home-aside">
          <section className="card goal-card">
            <div className="card-label">
              <span>
                <Target size={17} />
                {t('Твоя цель на неделю', 'Апталық мақсатың')}
              </span>
              <button
                className="icon-button"
                aria-label={t('Изменить цель', 'Мақсатты өзгерту')}
                onClick={() => navigate('settings')}
              >
                <ChevronRight size={17} />
              </button>
            </div>
            <div
              className="goal-ring"
              style={
                {
                  '--progress': `${Math.min(100, (weekly / state.weeklyGoal) * 100)}%`,
                } as React.CSSProperties
              }
            >
              <div>
                <Footprints size={25} />
                <strong>{number(weekly, state.lang)}</strong>
                <span>
                  {t('из', '/')} {state.weeklyGoal} {t('км', 'км')}
                </span>
              </div>
            </div>
            <h3>
              {weekly >= state.weeklyGoal
                ? t('Цель достигнута!', 'Мақсатқа жеттің!')
                : t('Ты на верном пути', 'Сен дұрыс жолдасың')}
            </h3>
            <p>
              {weekly >= state.weeklyGoal
                ? t('Самое время поставить новую.', 'Жаңа мақсат қоятын кез келді.')
                : t(
                    `Осталось ${number(Math.max(0, state.weeklyGoal - weekly), state.lang)} км до маленькой победы.`,
                    `Кішкентай жеңіске ${number(Math.max(0, state.weeklyGoal - weekly), state.lang)} км қалды.`,
                  )}
            </p>
            <div className="week-days">
              {Array.from({ length: 7 }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - 6 + i);
                const active = state.runs.some((r) => dateKey(new Date(r.date)) === dateKey(d));
                return (
                  <span key={i} className={active ? 'done' : ''}>
                    <small>
                      {d.toLocaleDateString(state.lang === 'ru' ? 'ru' : 'kk', {
                        weekday: 'short',
                      })}
                    </small>
                    <i>{active ? <Check size={12} /> : d.getDate()}</i>
                  </span>
                );
              })}
            </div>
          </section>
          <section className="challenge-feature">
            <div className="challenge-feature-top">
              <Badge kind="warm">{t('ЧЕЛЛЕНДЖ', 'ЧЕЛЛЕНДЖ')}</Badge>
              <Flag size={23} />
            </div>
            <h3>{t('Всё начинается\nс первого шага', 'Бәрі алғашқы\nқадамнан басталады')}</h3>
            <p>
              {t(
                'Новая тренировка. Первый километр. Твоя награда.',
                'Жаңа жаттығу. Алғашқы шақырым. Сенің сыйлығың.',
              )}
            </p>
            <div className="challenge-feature-bottom">
              <span>
                <Sparkles size={15} /> +30 {t('баллов', 'ұпай')}
              </span>
              <button
                className="round-arrow"
                aria-label={t('Открыть челленджи', 'Челлендждерді ашу')}
                onClick={() => navigate('challenges')}
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </section>
          <section className="water-card">
            <div className="water-heading">
              <span className="icon-tile blue">
                <Droplets size={22} />
              </span>
              <div>
                <h3>{t('Глоток заботы', 'Қамқорлық жұтымы')}</h3>
                <p>
                  {water} / {state.waterGoal} {t('мл', 'мл')}
                </p>
              </div>
              <button
                className="small-add"
                onClick={() => dispatch({ type: 'water', amount: 250 })}
                aria-label={t('Добавить 250 мл воды', '250 мл су қосу')}
              >
                +
              </button>
            </div>
            <Progress value={water} max={state.waterGoal} className="blue-progress" />
            <span className="microcopy">{t('Один стакан — 250 мл', 'Бір стақан — 250 мл')}</span>
          </section>
          <button className="assistant-teaser" onClick={() => navigate('assistant')}>
            <span className="assistant-symbol">
              <Sparkles size={21} />
            </span>
            <span>
              <strong>{t('Рядом на каждом шаге', 'Әр қадамда қасыңдамыз')}</strong>
              <small>{t('Спроси своего ИИ-ассистента', 'ЖИ көмекшіңнен сұра')}</small>
            </span>
            <ChevronRight size={17} />
          </button>
        </aside>
      </div>
    </>
  );
}

export function RoutesScreen({ startRun }: { startRun: (id: string) => void }) {
  const { t, l } = useApp();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Route | null>(null);
  const close = useCallback(() => setSelected(null), []);
  const filtered = routes.filter(
    (r) =>
      (filter === 'all' || r.kind === filter) &&
      l(r.name).toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <PageHeading
        title={t('Город ждёт тебя', 'Қала сені күтуде')}
        subtitle={t(
          'Найди маршрут под настроение и свой темп.',
          'Көңіл күйің мен қарқыныңа сай бағытты тап.',
        )}
        action={
          <Badge>
            <MapPin size={14} /> {t('Шымкент', 'Шымкент')}
          </Badge>
        }
      />
      <div className="toolbar">
        <label className="search-field">
          <Search size={19} />
          <input
            aria-label={t('Поиск маршрута', 'Бағыт іздеу')}
            placeholder={t('Куда отправимся?', 'Қайда барамыз?')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              aria-label={t('Очистить поиск', 'Іздеуді тазалау')}
              onClick={() => setSearch('')}
            >
              <X size={16} />
            </button>
          )}
        </label>
        <div className="tabs">
          {[
            ['all', 'Все', 'Барлығы'],
            ['parks', 'Парки', 'Саябақтар'],
            ['city', 'Город', 'Қала'],
            ['mountains', 'За городом', 'Қала сыртында'],
          ].map(([id, ru, kk]) => (
            <button
              key={id}
              className={filter === id ? 'active' : ''}
              onClick={() => setFilter(id)}
            >
              {t(ru, kk)}
            </button>
          ))}
        </div>
      </div>
      <div className="routes-grid">
        {filtered.map((r) => (
          <article className="route-card card" key={r.id}>
            <button className="route-art" onClick={() => setSelected(r)} aria-label={l(r.name)}>
              <Scene variant={r.art} />
              <Badge>{l(r.level)}</Badge>
              <span className="route-distance">
                {r.distance}
                <small>{t('км', 'км')}</small>
              </span>
            </button>
            <div className="route-card-body">
              <span className="eyebrow">
                {r.kind === 'mountains'
                  ? t('ЗА ГОРОДОМ', 'ҚАЛА СЫРТЫНДА')
                  : t('ШЫМКЕНТ', 'ШЫМКЕНТ')}
              </span>
              <h2>{l(r.name)}</h2>
              <p>{l(r.desc)}</p>
              <div className="route-meta">
                <span>
                  <Clock3 size={15} />
                  {r.minutes} {t('мин', 'мин')}
                </span>
                <span>
                  <Footprints size={15} />
                  {l(r.surface)}
                </span>
              </div>
              <button className="button outline full" onClick={() => setSelected(r)}>
                {t('Посмотреть маршрут', 'Бағытты көру')}
                <ArrowRight size={17} />
              </button>
            </div>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <Empty
          title={t('Маршрут не найден', 'Бағыт табылмады')}
          description={t(
            'Попробуй другое название или категорию.',
            'Басқа атауды немесе санатты таңда.',
          )}
        />
      )}
      <div className="notice">
        <Compass size={18} />
        {t(
          'Маршруты и иллюстрации подготовлены для демонстрации. Схемы не предназначены для реальной навигации.',
          'Бағыттар мен суреттер демонстрация үшін дайындалған. Сызбалар нақты навигацияға арналмаған.',
        )}
      </div>
      {selected && (
        <Modal title={l(selected.name)} onClose={close}>
          <RouteMap route={selected} />
          <div className="route-detail-stats">
            <span>
              <strong>
                {selected.distance} {t('км', 'км')}
              </strong>
              <small>{t('Дистанция', 'Қашықтық')}</small>
            </span>
            <span>
              <strong>{selected.minutes}</strong>
              <small>{t('Минут в пути', 'Жолдағы минуттар')}</small>
            </span>
            <span>
              <strong>{l(selected.level)}</strong>
              <small>{t('Сложность', 'Қиындық')}</small>
            </span>
          </div>
          <p>{l(selected.desc)}</p>
          <div className="detail-start">
            <MapPin size={18} />
            <span>
              <small>{t('Место старта', 'Бастау орны')}</small>
              <strong>{l(selected.spot)}</strong>
            </span>
          </div>
          <p className="microcopy">
            {t(
              'Демонстрационная схема. Перед реальной тренировкой проверь доступность и безопасность маршрута.',
              'Демонстрациялық сызба. Нақты жаттығу алдында бағыттың қолжетімділігі мен қауіпсіздігін тексер.',
            )}
          </p>
          <button
            className="button primary full"
            onClick={() => {
              startRun(selected.id);
              setSelected(null);
            }}
          >
            <Play size={16} />
            {t('Выбрать маршрут', 'Бағытты таңдау')}
          </button>
        </Modal>
      )}
    </>
  );
}

export function RunScreen({
  routeId,
  selectRoute,
  visible,
}: {
  routeId: string;
  selectRoute: (id: string) => void;
  visible: boolean;
}) {
  const { state, t, l, dispatch, navigate, notify } = useApp();
  const [status, setStatus] = useState<'idle' | 'running' | 'paused'>('idle');
  const [seconds, setSeconds] = useState(0);
  const [activity, setActivity] = useState(0);
  const [activeRoute, setActiveRoute] = useState(routeId);
  const [result, setResult] = useState<Run | null>(null);
  const [confirm, setConfirm] = useState(false);
  const finished = useRef(false);
  const route =
    routes.find((r) => r.id === (status === 'idle' ? routeId : activeRoute)) || routes[0];
  const speed = [10, 7, 5][activity];
  const distance = Math.min(route.distance, (seconds / 3600) * speed);
  const targetSeconds = (route.distance / speed) * 3600;
  useEffect(() => {
    if (status !== 'running') return;
    let last = Date.now();
    const id = setInterval(() => {
      const now = Date.now();
      const delta = (now - last) / 1000;
      last = now;
      setSeconds((s) => Math.min(targetSeconds, s + delta * 15));
    }, 200);
    return () => clearInterval(id);
  }, [status, targetSeconds]);
  useEffect(() => {
    if (status === 'running' && seconds >= targetSeconds) setStatus('paused');
  }, [seconds, status, targetSeconds]);
  const closeResult = useCallback(() => {
    setResult(null);
    navigate('statistics');
  }, [navigate]);
  const closeConfirm = useCallback(() => setConfirm(false), []);
  const finish = (full = false) => {
    if (finished.current) return;
    const km = full ? route.distance : Math.round(distance * 100) / 100;
    const duration = full ? targetSeconds : Math.floor(seconds);
    if (km < 0.01) {
      notify(
        t(
          'Дай тренировке пройти хотя бы несколько секунд.',
          'Жаттығуды кемінде бірнеше секунд жалғастыр.',
        ),
      );
      return;
    }
    finished.current = true;
    const run: Run = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      distance: km,
      seconds: duration,
      activity,
      routeId: route.id,
      points: Math.floor(km * 10),
    };
    dispatch({ type: 'run', run });
    setStatus('idle');
    setSeconds(0);
    setResult(run);
  };
  const start = () => {
    finished.current = false;
    setActiveRoute(routeId);
    setSeconds(0);
    setStatus('running');
  };
  return (
    <>
      <PageHeading
        title={t('В твоём ритме', 'Өз ырғағыңмен')}
        subtitle={t(
          'Почувствуй, как один шаг превращается в привычку.',
          'Бір қадамның әдетке айналғанын сезін.',
        )}
        action={<Badge kind="warm">{t('Демо-тренировка', 'Демо жаттығу')}</Badge>}
      />
      <div className="run-layout">
        <div className="card run-map-card">
          <RouteMap route={route} progress={distance / route.distance} />
          <div className="run-map-caption">
            <MapPin size={20} />
            <span>
              <strong>{l(route.name)}</strong>
              <small>
                {route.distance} {t('км', 'км')} · {l(route.surface)}
              </small>
            </span>
            <Badge>{l(route.level)}</Badge>
          </div>
        </div>
        <div className="card run-control">
          <div className="run-status">
            <span className={`status-dot ${status === 'running' ? 'pulse' : ''}`} />
            {status === 'running'
              ? t('Тренировка идёт', 'Жаттығу жүріп жатыр')
              : status === 'paused'
                ? t('На паузе', 'Үзіліс')
                : t('Готов к старту', 'Бастауға дайын')}
          </div>
          <div className="activity-choice">
            {activityNames.map((a, i) => (
              <button
                key={i}
                className={activity === i ? 'active' : ''}
                disabled={status !== 'idle'}
                onClick={() => setActivity(i)}
              >
                <Footprints size={18} />
                {l(a)}
              </button>
            ))}
          </div>
          <div className="run-distance">
            <span>{t('Дистанция', 'Қашықтық')}</span>
            <strong>
              {number(distance, state.lang, 2)}
              <small> {t('км', 'км')}</small>
            </strong>
          </div>
          <div className="run-metrics">
            <div>
              <Timer size={17} />
              <strong>{formatTime(seconds)}</strong>
              <small>{t('Время', 'Уақыт')}</small>
            </div>
            <div>
              <ActivityIcon />
              <strong>{formatTime(3600 / speed)}</strong>
              <small>{t('мин / км', 'мин / км')}</small>
            </div>
            <div>
              <Flame size={17} />
              <strong>
                {Math.round(distance * state.profile.weight * (activity === 0 ? 1 : 0.55))}
              </strong>
              <small>{t('ккал ≈', 'ккал ≈')}</small>
            </div>
          </div>
          <Progress value={distance} max={route.distance} />
          <div className="run-finish-caption">
            <span>{t('Старт', 'Бастау')}</span>
            <span>
              {route.distance} {t('км', 'км')}
            </span>
          </div>
          {status === 'idle' ? (
            <>
              <label className="field">
                <span>{t('Маршрут', 'Бағыт')}</span>
                <select value={routeId} onChange={(e) => selectRoute(e.target.value)}>
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {l(r.name)} · {r.distance} {t('км', 'км')}
                    </option>
                  ))}
                </select>
              </label>
              <button className="button primary full" onClick={start}>
                <Play size={18} fill="currentColor" />
                {t('Начать демо-пробежку', 'Демо жүгіруді бастау')}
              </button>
            </>
          ) : (
            <>
              <div className="run-buttons">
                <button
                  className="button outline"
                  onClick={() => setStatus((s) => (s === 'running' ? 'paused' : 'running'))}
                  disabled={seconds >= targetSeconds}
                >
                  {status === 'running' ? <Pause size={18} /> : <Play size={18} />}{' '}
                  {status === 'running' ? t('Пауза', 'Үзіліс') : t('Продолжить', 'Жалғастыру')}
                </button>
                <button className="button primary" onClick={() => finish()}>
                  <Square size={15} fill="currentColor" />
                  {t('Завершить', 'Аяқтау')}
                </button>
              </div>
              <button className="button soft full" onClick={() => finish(true)}>
                <Flag size={17} />
                {t('Показать финиш маршрута', 'Бағыттың мәресін көрсету')}
              </button>
              <button className="text-button cancel-run" onClick={() => setConfirm(true)}>
                {t('Отменить тренировку', 'Жаттығудан бас тарту')}
              </button>
            </>
          )}
          <div className="run-demo-note">
            <Sparkles size={16} />
            <span>
              {t(
                'В демо время ускорено ×15. Кнопка «Показать финиш» сразу завершит весь маршрут. GPS не используется.',
                'Демода уақыт ×15 жылдамдатылған. «Бағыттың мәресін көрсету» бүкіл бағытты бірден аяқтайды. GPS қолданылмайды.',
              )}
            </span>
          </div>
        </div>
      </div>
      {result && visible && (
        <Modal title={t('Ты сделал это!', 'Сен мұны жасадың!')} onClose={closeResult}>
          <div className="finish-result">
            <span className="finish-medal">
              <Medal size={44} />
            </span>
            <Badge>{t('ТРЕНИРОВКА СОХРАНЕНА', 'ЖАТТЫҒУ САҚТАЛДЫ')}</Badge>
            <h2>{t('Ещё одна маленькая победа', 'Тағы бір кішкентай жеңіс')}</h2>
            <p>{l((routes.find((r) => r.id === result.routeId) || route).name)}</p>
            <div className="result-stats">
              <div>
                <strong>{number(result.distance, state.lang, 2)}</strong>
                <span>{t('километра', 'шақырым')}</span>
              </div>
              <div>
                <strong>{formatTime(result.seconds)}</strong>
                <span>{t('время', 'уақыт')}</span>
              </div>
              <div>
                <strong>+{result.points}</strong>
                <span>{t('баллов', 'ұпай')}</span>
              </div>
            </div>
            <p className="notice">
              {t(
                'Результат демо-тренировки добавлен в историю. Проверь прогресс своих челленджей!',
                'Демо жаттығудың нәтижесі тарихқа қосылды. Челлендждеріңнің ілгерілеуін тексер!',
              )}
            </p>
            <button
              className="button primary full"
              onClick={() => {
                setResult(null);
                navigate('challenges');
              }}
            >
              {t('К достижениям', 'Жетістіктерге')}
              <Trophy size={18} />
            </button>
            <button className="button outline full" onClick={closeResult}>
              {t('Моя статистика', 'Менің статистикам')}
            </button>
          </div>
        </Modal>
      )}
      {confirm && (
        <Modal
          title={t('Отменить тренировку?', 'Жаттығудан бас тарту керек пе?')}
          onClose={closeConfirm}
        >
          <p>
            {t(
              'Текущий прогресс не сохранится. Предыдущие тренировки останутся в истории.',
              'Ағымдағы ілгерілеу сақталмайды. Бұрынғы жаттығулар тарихта қалады.',
            )}
          </p>
          <button
            className="button danger full"
            onClick={() => {
              setStatus('idle');
              setSeconds(0);
              setConfirm(false);
            }}
          >
            {t('Отменить тренировку', 'Жаттығудан бас тарту')}
          </button>
          <button className="button outline full" onClick={closeConfirm}>
            {t('Вернуться', 'Қайту')}
          </button>
        </Modal>
      )}
    </>
  );
}
function ActivityIcon() {
  return <TrendingUp size={17} />;
}

export function StatisticsScreen() {
  const { state, t, l, navigate } = useApp();
  const [period, setPeriod] = useState(7);
  const [detail, setDetail] = useState<Run | null>(null);
  const close = useCallback(() => setDetail(null), []);
  const recent = state.runs.filter(
    (r) => Date.now() - new Date(r.date).getTime() < period * 86400000,
  );
  const km = recent.reduce((s, r) => s + r.distance, 0);
  const secs = recent.reduce((s, r) => s + r.seconds, 0);
  const calories = recent.reduce(
    (s, r) => s + r.distance * state.profile.weight * (r.activity === 0 ? 1 : 0.55),
    0,
  );
  const bars = Array.from({ length: 7 }, (_, i) => {
    const days = period === 7 ? 1 : Math.ceil(period / 7);
    const end = new Date();
    end.setDate(end.getDate() - (6 - i) * days);
    const start = new Date(end);
    start.setDate(start.getDate() - days + 1);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return {
      label:
        period === 7
          ? end.toLocaleDateString(state.lang === 'ru' ? 'ru' : 'kk', { weekday: 'short' })
          : `${start.getDate()}–${end.getDate()}`,
      value: state.runs
        .filter((r) => new Date(r.date) >= start && new Date(r.date) <= end)
        .reduce((s, r) => s + r.distance, 0),
    };
  });
  const max = Math.max(5, ...bars.map((b) => b.value));
  return (
    <>
      <PageHeading
        title={t('Каждый шаг — в зачёт', 'Әр қадам есепте')}
        subtitle={t(
          'Твоя история движения и маленьких побед.',
          'Қозғалысың мен кішкентай жеңістеріңнің тарихы.',
        )}
        action={
          <div className="tabs">
            <button className={period === 7 ? 'active' : ''} onClick={() => setPeriod(7)}>
              {t('7 дней', '7 күн')}
            </button>
            <button className={period === 30 ? 'active' : ''} onClick={() => setPeriod(30)}>
              {t('30 дней', '30 күн')}
            </button>
          </div>
        }
      />
      <div className="metric-grid">
        <div className="card metric">
          <Footprints />
          <span>{t('Дистанция', 'Қашықтық')}</span>
          <strong>
            {number(km, state.lang)} <small>{t('км', 'км')}</small>
          </strong>
        </div>
        <div className="card metric">
          <Timer />
          <span>{t('В движении', 'Қозғалыста')}</span>
          <strong>
            {Math.round(secs / 60)} <small>{t('мин', 'мин')}</small>
          </strong>
        </div>
        <div className="card metric">
          <Flame />
          <span>{t('Энергия, оценка', 'Қуат, бағалау')}</span>
          <strong>
            {Math.round(calories)} <small>{t('ккал', 'ккал')}</small>
          </strong>
        </div>
        <div className="card metric">
          <Trophy />
          <span>{t('Тренировки', 'Жаттығулар')}</span>
          <strong>{recent.length}</strong>
        </div>
      </div>
      <div className="statistics-grid">
        <section className="card chart-card">
          <SectionTitle title={t('Твой ритм', 'Сенің ырғағың')} />
          <div
            className="chart"
            role="img"
            aria-label={t(
              `Дистанция за ${period} дней: ${number(km, state.lang)} км`,
              `Соңғы ${period} күндегі қашықтық: ${number(km, state.lang)} км`,
            )}
          >
            {bars.map((b, i) => (
              <div className="chart-column" key={i}>
                <span>{number(b.value, state.lang)}</span>
                <div className="bar-track">
                  <i
                    style={{ height: `${Math.max(2, (b.value / max) * 100)}%` }}
                    className={i === 6 ? 'current' : ''}
                  />
                </div>
                <small>{b.label}</small>
              </div>
            ))}
          </div>
          <div className="chart-legend">
            <i />
            {t('Пройдено километров', 'Жүрілген шақырымдар')}
          </div>
        </section>
        <section className="card records-card">
          <SectionTitle title={t('Личные рекорды', 'Жеке рекордтар')} />
          <div>
            <span className="icon-tile sand">
              <Medal />
            </span>
            <span>
              <small>{t('Самая длинная тренировка', 'Ең ұзақ жаттығу')}</small>
              <strong>
                {number(Math.max(0, ...state.runs.map((r) => r.distance)), state.lang)}{' '}
                {t('км', 'км')}
              </strong>
            </span>
          </div>
          <div>
            <span className="icon-tile">
              <Footprints />
            </span>
            <span>
              <small>{t('Всего пройдено', 'Барлығы жүрілген')}</small>
              <strong>
                {number(totalKm(state), state.lang)} {t('км', 'км')}
              </strong>
            </span>
          </div>
          <div>
            <span className="icon-tile peach">
              <Sparkles />
            </span>
            <span>
              <small>{t('Всего заработано', 'Барлығы жиналған')}</small>
              <strong>
                {state.earned} {t('баллов', 'ұпай')}
              </strong>
            </span>
          </div>
        </section>
      </div>
      <SectionTitle
        title={t('История тренировок', 'Жаттығу тарихы')}
        action={t('Новая тренировка', 'Жаңа жаттығу')}
        onClick={() => navigate('run')}
      />
      <div className="card history-list">
        {state.runs.map((r) => (
          <button key={r.id} className="history-item" onClick={() => setDetail(r)}>
            <span className="icon-tile">
              <Footprints size={21} />
            </span>
            <span className="history-name">
              <strong>{l((routes.find((rt) => rt.id === r.routeId) || routes[0]).name)}</strong>
              <small>
                {new Date(r.date).toLocaleDateString(state.lang === 'ru' ? 'ru' : 'kk', {
                  day: 'numeric',
                  month: 'short',
                })}{' '}
                · {l(activityNames[r.activity])}
              </small>
            </span>
            <span className="history-distance">
              <strong>
                {number(r.distance, state.lang, 2)} {t('км', 'км')}
              </strong>
              <small>{formatTime(r.seconds)}</small>
            </span>
            <span className="history-points">+{r.points}</span>
            <ChevronRight size={17} />
          </button>
        ))}
      </div>
      <p className="microcopy">
        {t(
          'История содержит стартовые примеры и твои демо-тренировки. Калории — приблизительная оценка, а не данные датчика.',
          'Тарихта бастапқы мысалдар мен демо жаттығуларың бар. Калориялар — сенсор деректері емес, шамамен есеп.',
        )}
      </p>
      {detail && (
        <Modal title={t('Результат тренировки', 'Жаттығу нәтижесі')} onClose={close}>
          <RouteMap route={routes.find((r) => r.id === detail.routeId) || routes[0]} progress={1} />
          <div className="result-stats">
            <div>
              <strong>{number(detail.distance, state.lang, 2)}</strong>
              <span>{t('км', 'км')}</span>
            </div>
            <div>
              <strong>{formatTime(detail.seconds)}</strong>
              <span>{t('время', 'уақыт')}</span>
            </div>
            <div>
              <strong>+{detail.points}</strong>
              <span>{t('баллов', 'ұпай')}</span>
            </div>
          </div>
          <p>
            {new Date(detail.date).toLocaleString(state.lang === 'ru' ? 'ru-RU' : 'kk-KZ')} ·{' '}
            {l(activityNames[detail.activity])}
          </p>
          <Badge>{t('Демонстрационная тренировка', 'Демонстрациялық жаттығу')}</Badge>
        </Modal>
      )}
    </>
  );
}
