import { useCallback, useState } from 'react';
import {
  ArrowRight,
  Award,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Copy,
  Footprints,
  Gift,
  Heart,
  Leaf,
  MapPin,
  Medal,
  Plus,
  Sparkles,
  Ticket,
  Trophy,
  Users,
} from 'lucide-react';
import { categories, challenges, charities, leaderboard, partners } from '../data';
import { challengeProgress, totalKm } from '../store';
import {
  Achievement,
  Badge,
  Icon,
  Modal,
  PageHeading,
  Progress,
  Scene,
  SectionTitle,
  useApp,
} from '../ui';

export function ChallengesScreen() {
  const { state, dispatch, t, l, notify, navigate } = useApp();
  const [tab, setTab] = useState('challenges');
  const [category, setCategory] = useState(-1);
  const ranking = [
    ...leaderboard.map((r, i) => ({ ...r, id: `p${i}`, self: false })),
    {
      id: 'me',
      name: state.profile.name,
      points: state.earned,
      km: totalKm(state),
      category: state.profile.category,
      color: '#d8e5ce',
      self: true,
    },
  ]
    .filter((r) => category < 0 || r.category === category)
    .sort((a, b) => b.points - a.points);
  return (
    <>
      <PageHeading
        title={t('Больше движения. Больше тебя.', 'Көбірек қозғалыс. Көбірек мүмкіндік.')}
        subtitle={t(
          'Ставь маленькие цели. Празднуй большие победы.',
          'Кішкентай мақсаттар қой. Үлкен жеңістерді тойла.',
        )}
        action={
          <Badge>
            <Sparkles size={14} />
            {state.balance} {t('баллов', 'ұпай')}
          </Badge>
        }
      />
      <div className="tabs page-tabs">
        {[
          ['challenges', 'Челленджи', 'Челлендждер'],
          ['rating', 'Рейтинг', 'Рейтинг'],
          ['achievements', 'Мои достижения', 'Менің жетістіктерім'],
        ].map(([id, ru, kk]) => (
          <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>
            {t(ru, kk)}
          </button>
        ))}
      </div>
      {tab === 'challenges' && (
        <>
          <div className="feature-banner green">
            <div>
              <span className="eyebrow">{t('ТВОЯ НОВАЯ ПРИВЫЧКА', 'СЕНІҢ ЖАҢА ӘДЕТІҢ')}</span>
              <h2>
                {t(
                  'Не быстрее других.\nБлиже к своей цели.',
                  'Басқалардан жылдам емес.\nӨз мақсатыңа жақынырақ.',
                )}
              </h2>
              <p>
                {t(
                  'Присоединяйся к челленджу до тренировки — новые километры пойдут в зачёт.',
                  'Жаттығуға дейін челленджге қосыл — жаңа шақырымдар есепке алынады.',
                )}
              </p>
            </div>
            <span className="banner-art">
              <FlagArt />
            </span>
          </div>
          <div className="challenge-grid">
            {challenges.map((c) => {
              const joined = state.joined[c.id];
              const value = challengeProgress(state, c.id);
              const complete = value >= c.target - 0.00001;
              return (
                <article className="card challenge-card" key={c.id}>
                  <div className="challenge-card-heading">
                    <span className="icon-tile large">
                      <Icon name={c.icon} size={27} />
                    </span>
                    <Badge kind="warm">
                      +{c.reward} {t('баллов', 'ұпай')}
                    </Badge>
                  </div>
                  <h2>{l(c.title)}</h2>
                  <p>{l(c.desc)}</p>
                  <div className="challenge-progress-label">
                    <span>
                      {joined
                        ? t('Твой прогресс', 'Сенің ілгерілеуің')
                        : t('Готов к старту?', 'Бастауға дайынсың ба?')}
                    </span>
                    <strong>
                      {Number(value.toFixed(1))} / {c.target}{' '}
                      {c.unit === 'km' ? t('км', 'км') : t('трен.', 'жатт.')}
                    </strong>
                  </div>
                  <Progress value={value} max={c.target} />
                  {!joined ? (
                    <button
                      className="button primary full"
                      onClick={() => {
                        dispatch({ type: 'join', id: c.id });
                        notify(
                          t(
                            'Ты в деле! Новые тренировки пойдут в зачёт.',
                            'Сен қосылдың! Жаңа жаттығулар есепке алынады.',
                          ),
                        );
                      }}
                    >
                      {t('Присоединиться', 'Қосылу')}
                      <Plus size={17} />
                    </button>
                  ) : joined.claimed ? (
                    <button className="button soft full" disabled>
                      <Check size={17} />
                      {t('Награда получена', 'Сыйлық алынды')}
                    </button>
                  ) : complete ? (
                    <button
                      className="button primary full"
                      onClick={() => {
                        dispatch({ type: 'claim', id: c.id });
                        notify(
                          t(
                            `Отлично! +${c.reward} баллов на твоём балансе.`,
                            `Керемет! Балансыңа +${c.reward} ұпай қосылды.`,
                          ),
                        );
                      }}
                    >
                      <Gift size={17} />
                      {t('Забрать награду', 'Сыйлықты алу')}
                    </button>
                  ) : (
                    <button className="button outline full" onClick={() => navigate('run')}>
                      <Footprints size={17} />
                      {t('На тренировку', 'Жаттығуға')}
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        </>
      )}
      {tab === 'rating' && (
        <>
          <div className="rating-toolbar">
            <div>
              <h2>{t('Вместе — дальше', 'Бірге — алға')}</h2>
              <p>
                {t(
                  'Рейтинг по заработанным баллам за всё время.',
                  'Барлық уақытта жиналған ұпайлар рейтингі.',
                )}
              </p>
            </div>
            <label className="field compact">
              <span>{t('Категория', 'Санат')}</span>
              <select value={category} onChange={(e) => setCategory(Number(e.target.value))}>
                <option value={-1}>{t('Все участники', 'Барлық қатысушылар')}</option>
                {categories.map((c, i) => (
                  <option value={i} key={i}>
                    {l(c)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="podium">
            {ranking.slice(0, 3).map((r, i) => (
              <div className={`podium-card place-${i + 1}`} key={r.id}>
                <span className="podium-rank">
                  <Trophy size={18} /> {i + 1}
                </span>
                <span className="podium-avatar" style={{ background: r.color }}>
                  {r.name.slice(0, 1)}
                </span>
                <strong>
                  {r.name}
                  {r.self && ` (${t('ты', 'сен')})`}
                </strong>
                <span>
                  {r.points} {t('баллов', 'ұпай')}
                </span>
              </div>
            ))}
          </div>
          <div className="card ranking-list">
            {ranking.map((r, i) => (
              <div className={`ranking-row ${r.self ? 'self' : ''}`} key={r.id}>
                <span className="rank-position">{i + 1}</span>
                <span className="avatar" style={{ background: r.color }}>
                  {r.name.slice(0, 1)}
                </span>
                <span className="ranking-name">
                  <strong>
                    {r.name}
                    {r.self && <Badge>{t('Ты', 'Сен')}</Badge>}
                  </strong>
                  <small>{l(categories[r.category])}</small>
                </span>
                <span className="ranking-km">
                  {r.km.toFixed(1)} {t('км', 'км')}
                </span>
                <strong>
                  {r.points}
                  <small> {t('баллов', 'ұпай')}</small>
                </strong>
              </div>
            ))}
          </div>
          <div className="notice">
            <Users size={18} />
            {t(
              'Участники рейтинга вымышлены. Твоя строка обновляется после тренировок и получения наград. Трата баллов не снижает рейтинг.',
              'Рейтинг қатысушылары ойдан шығарылған. Сенің жолың жаттығулар мен сыйлықтардан кейін жаңарады. Ұпай жұмсау рейтингті төмендетпейді.',
            )}
          </div>
        </>
      )}
      {tab === 'achievements' && (
        <>
          <section className="card achievements-overview">
            <span className="finish-medal">
              <Award size={40} />
            </span>
            <h2>{t('Твои поводы гордиться собой', 'Өзіңді мақтан тұтар себептерің')}</h2>
            <p>
              {t(
                'Значки открываются вместе с твоим прогрессом.',
                'Белгілер ілгерілеуіңе қарай ашылады.',
              )}
            </p>
            <div className="achievements-grid">
              <Achievement
                icon="foot"
                title={t('Первая тренировка', 'Алғашқы жаттығу')}
                unlocked={state.runs.length > 0}
              />
              <Achievement
                icon="flag"
                title={t('5 км в движении', 'Қозғалыстағы 5 км')}
                unlocked={totalKm(state) >= 5}
              />
              <Achievement
                icon="flame"
                title={t('10 тренировок', '10 жаттығу')}
                unlocked={state.runs.length >= 10}
              />
              <Achievement
                icon="heart"
                title={t('Доброе сердце', 'Мейірімді жүрек')}
                unlocked={state.donations.length > 0}
              />
              <Achievement
                icon="people"
                title={t('Вместе сильнее', 'Бірге мықтымыз')}
                unlocked={state.events.length > 0}
              />
              <Achievement
                icon="trophy"
                title={t('Победитель челленджа', 'Челлендж жеңімпазы')}
                unlocked={Object.values(state.joined).some((j) => j.claimed)}
              />
            </div>
          </section>
          <div className="notice">
            {t(
              'Серые значки ещё впереди: завершай тренировки, участвуй в событиях и помогай городу.',
              'Сұр белгілер әлі алда: жаттығуларды аяқта, іс-шараларға қатыс және қалаға көмектес.',
            )}
          </div>
        </>
      )}
    </>
  );
}
function FlagArt() {
  return (
    <div className="flag-art">
      <Trophy size={88} strokeWidth={1.2} />
      <span>01</span>
      <i />
      <i />
    </div>
  );
}

export function CommunityScreen() {
  const { state, dispatch, t, l, notify } = useApp();
  const [tab, setTab] = useState('partners');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<(typeof partners)[number] | null>(null);
  const close = useCallback(() => setSelected(null), []);
  const coupon = selected ? state.coupons.find((c) => c.partnerId === selected.id) : undefined;
  const events = [
    {
      id: 'morning',
      name: t('Утро начинается с движения', 'Таң қозғалыстан басталады'),
      desc: t('Лёгкий совместный бег для любого уровня.', 'Барлық деңгейге арналған жеңіл жүгіру.'),
      place: t('Парк Независимости', 'Тәуелсіздік саябағы'),
      time: t('Суббота · 08:00', 'Сенбі · 08:00'),
      icon: 'foot',
    },
    {
      id: 'walk',
      name: t('Прогулка без спешки', 'Асықпай серуендеу'),
      desc: t(
        'Знакомимся, общаемся и гуляем в своём темпе.',
        'Танысып, сөйлесіп, өз қарқынымызбен жүреміз.',
      ),
      place: t('Дендропарк', 'Дендросаябақ'),
      time: t('Воскресенье · 09:00', 'Жексенбі · 09:00'),
      icon: 'people',
    },
  ];
  return (
    <>
      <PageHeading
        title={t('Двигаться лучше вместе', 'Бірге қозғалған жақсы')}
        subtitle={t(
          'Люди, места и приятные поводы выйти из дома.',
          'Адамдар, орындар және үйден шығуға жақсы себептер.',
        )}
        action={
          <Badge>
            <Sparkles size={14} />
            {state.balance} {t('баллов', 'ұпай')}
          </Badge>
        }
      />
      <div className="tabs page-tabs">
        {[
          ['partners', 'Партнёры', 'Серіктестер'],
          ['community', 'Сообщество', 'Қауымдастық'],
          ['coupons', 'Мои купоны', 'Менің купондарым'],
        ].map(([id, ru, kk]) => (
          <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>
            {t(ru, kk)}
            {id === 'coupons' && state.coupons.length > 0 && (
              <span className="count">{state.coupons.length}</span>
            )}
          </button>
        ))}
      </div>
      {tab === 'partners' && (
        <>
          <div className="feature-banner sand-banner">
            <div>
              <span className="eyebrow">{t('ПРИЯТНОЕ ЗА ПОЛЕЗНОЕ', 'ПАЙДАЛЫ ІС ҮШІН СЫЙЛЫҚ')}</span>
              <h2>
                {t('Твоя активность\nвозвращается бонусами.', 'Белсенділігің\nбонусқа айналады.')}
              </h2>
              <p>
                {t(
                  'Выбирай предложение и обменивай заработанные баллы.',
                  'Ұсынысты таңдап, жинаған ұпайларыңды айырбаста.',
                )}
              </p>
            </div>
            <Gift size={90} strokeWidth={1.2} />
          </div>
          <div className="filter-pills">
            {[
              ['all', 'Все', 'Барлығы'],
              ['fitness', 'Фитнес', 'Фитнес'],
              ['nutrition', 'Спортпит', 'Спорттық тағам'],
              ['clothes', 'Одежда', 'Киім'],
              ['food', 'Продукты', 'Азық-түлік'],
            ].map(([id, ru, kk]) => (
              <button
                className={filter === id ? 'active' : ''}
                key={id}
                onClick={() => setFilter(id)}
              >
                {t(ru, kk)}
              </button>
            ))}
          </div>
          <div className="partners-grid">
            {partners
              .filter((p) => filter === 'all' || p.category === filter)
              .map((p) => (
                <button className="card partner-card" key={p.id} onClick={() => setSelected(p)}>
                  <span
                    className="partner-logo"
                    style={{ color: p.color, background: `${p.color}12` }}
                  >
                    {p.initials}
                  </span>
                  <h3>{p.name}</h3>
                  <p>{l(p.offer)}</p>
                  <div>
                    <Badge>
                      <Sparkles size={12} />
                      {p.cost} {t('баллов', 'ұпай')}
                    </Badge>
                    <ChevronRight size={17} />
                  </div>
                  {state.coupons.some((c) => c.partnerId === p.id) && (
                    <span className="partner-owned">
                      <Check size={12} />
                      {t('Купон получен', 'Купон алынды')}
                    </span>
                  )}
                </button>
              ))}
          </div>
          <div className="notice">
            <Ticket size={18} />
            {t(
              'Примеры возможных партнёрств. Предложения и купоны демонстрационные, договорённости с компаниями не заявлены.',
              'Ықтимал серіктестіктердің мысалдары. Ұсыныстар мен купондар демонстрациялық, компаниялармен келісімдер жарияланбаған.',
            )}
          </div>
        </>
      )}
      {tab === 'community' && (
        <>
          <SectionTitle title={t('Найди свою компанию', 'Өз ортаңды тап')} />
          <div className="community-banner">
            <span className="community-avatars">
              <i>А</i>
              <i>М</i>
              <i>Д</i>
              <i>+</i>
            </span>
            <div>
              <h2>{t('Разный темп. Одна команда.', 'Әртүрлі қарқын. Бір команда.')}</h2>
              <p>
                {t(
                  'Для школьников, студентов, госслужащих, пенсионеров и старших участников — каждому найдётся место.',
                  'Оқушылар, студенттер, мемлекеттік қызметкерлер, зейнеткерлер және егде жастағылар — әркімге орын бар.',
                )}
              </p>
            </div>
          </div>
          <SectionTitle title={t('Ближайшие встречи', 'Алдағы кездесулер')} />
          <div className="event-grid">
            {events.map((e) => (
              <article className="card event-card" key={e.id}>
                <span className="icon-tile large">
                  <Icon name={e.icon} size={27} />
                </span>
                <Badge kind="warm">{t('Демо-событие', 'Демо іс-шара')}</Badge>
                <h2>{e.name}</h2>
                <p>{e.desc}</p>
                <div className="event-meta">
                  <span>
                    <CalendarDays size={17} />
                    {e.time}
                  </span>
                  <span>
                    <MapPin size={17} />
                    {e.place}
                  </span>
                </div>
                <button
                  className={`button ${state.events.includes(e.id) ? 'outline' : 'primary'} full`}
                  onClick={() => {
                    dispatch({ type: 'event', id: e.id });
                    notify(
                      state.events.includes(e.id)
                        ? t('Участие отменено', 'Қатысудан бас тартылды')
                        : t('Ты в списке демо-участников!', 'Сен демо қатысушылар тізіміндесің!'),
                    );
                  }}
                >
                  {state.events.includes(e.id) ? (
                    <>
                      <Check size={17} />
                      {t('Вы участвуете · отменить', 'Сіз қатысасыз · бас тарту')}
                    </>
                  ) : (
                    t('Присоединиться', 'Қосылу')
                  )}
                </button>
              </article>
            ))}
          </div>
          <p className="microcopy">
            {t(
              'Встречи приведены для презентации и не являются объявлениями реальных мероприятий.',
              'Кездесулер презентация үшін берілген, олар нақты іс-шаралардың хабарландырулары емес.',
            )}
          </p>
        </>
      )}
      {tab === 'coupons' && (
        <>
          <SectionTitle title={t('Награды за твоё движение', 'Қозғалысың үшін сыйлықтар')} />
          {state.coupons.length === 0 ? (
            <div className="empty">
              <Gift size={36} />
              <h3>{t('Твой первый бонус впереди', 'Алғашқы бонусың алда')}</h3>
              <p>
                {t(
                  'Обменяй баллы на предложение в разделе партнёров.',
                  'Серіктестер бөлімінде ұпайларыңды ұсынысқа айырбаста.',
                )}
              </p>
              <button className="button primary" onClick={() => setTab('partners')}>
                {t('Выбрать бонус', 'Бонус таңдау')}
              </button>
            </div>
          ) : (
            <div className="coupon-grid">
              {state.coupons.map((c) => {
                const p = partners.find((p) => p.id === c.partnerId)!;
                return (
                  <button key={c.id} className="coupon-card" onClick={() => setSelected(p)}>
                    <Ticket size={29} />
                    <span>
                      <strong>{p.name}</strong>
                      <small>{l(p.offer)}</small>
                      <code>{c.code}</code>
                    </span>
                    <Badge>{t('Демо', 'Демо')}</Badge>
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}
      {selected && (
        <Modal
          title={
            coupon
              ? t('Твой демо-купон', 'Сенің демо купоның')
              : t('Награда за активность', 'Белсенділік үшін сыйлық')
          }
          onClose={close}
        >
          <div className="partner-modal">
            <span
              className="partner-logo"
              style={{ color: selected.color, background: `${selected.color}12` }}
            >
              {selected.initials}
            </span>
            <h2>{selected.name}</h2>
            <p>{l(selected.offer)}</p>
            {coupon ? (
              <>
                <div className="coupon-code">{coupon.code}</div>
                <Badge>{t('Только для демонстрации', 'Тек демонстрация үшін')}</Badge>
                <button
                  className="button outline full"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(coupon.code);
                      notify(t('Код скопирован', 'Код көшірілді'));
                    } catch {
                      notify(
                        t(
                          'Копирование недоступно. Код можно выделить вручную.',
                          'Көшіру қолжетімсіз. Кодты қолмен таңдауға болады.',
                        ),
                      );
                    }
                  }}
                >
                  <Copy size={17} />
                  {t('Скопировать код', 'Кодты көшіру')}
                </button>
              </>
            ) : (
              <>
                <div className="price-line">
                  <span>{t('Стоимость', 'Құны')}</span>
                  <strong>
                    {selected.cost} {t('баллов', 'ұпай')}
                  </strong>
                </div>
                <div className="price-line">
                  <span>{t('Твой баланс', 'Сенің балансың')}</span>
                  <strong>
                    {state.balance} {t('баллов', 'ұпай')}
                  </strong>
                </div>
                <button
                  className="button primary full"
                  disabled={state.balance < selected.cost}
                  onClick={() => {
                    dispatch({
                      type: 'redeem',
                      partnerId: selected.id,
                      cost: selected.cost,
                      id: crypto.randomUUID(),
                    });
                    notify(
                      t(
                        'Купон добавлен в «Мои купоны»',
                        'Купон «Менің купондарым» бөліміне қосылды',
                      ),
                    );
                  }}
                >
                  {state.balance < selected.cost
                    ? t('Пока не хватает баллов', 'Әзірге ұпай жеткіліксіз')
                    : t('Обменять баллы', 'Ұпайларды айырбастау')}
                  <Gift size={17} />
                </button>
              </>
            )}
            <p className="microcopy">
              {t(
                'Это пример предложения. Купон не даёт реальной скидки и не принимается в магазине.',
                'Бұл ұсыныс мысалы. Купон нақты жеңілдік бермейді және дүкенде қабылданбайды.',
              )}
            </p>
          </div>
        </Modal>
      )}
    </>
  );
}

export function CharityScreen() {
  const { state, dispatch, t, l, notify } = useApp();
  const [selected, setSelected] = useState<(typeof charities)[number] | null>(null);
  const [amount, setAmount] = useState(50);
  const close = useCallback(() => setSelected(null), []);
  const donated = state.donations.reduce((s, d) => s + d.amount, 0);
  return (
    <>
      <PageHeading
        title={t('Бег — это добро', 'Жүгіру — жақсылық')}
        subtitle={t(
          'Большие изменения складываются из маленьких шагов.',
          'Үлкен өзгерістер кішкентай қадамдардан құралады.',
        )}
        action={
          <Badge>
            <Heart size={14} />
            {donated} {t('баллов добра', 'жақсылық ұпайы')}
          </Badge>
        }
      />
      <div className="charity-hero">
        <div>
          <span className="eyebrow">{t('ВМЕСТЕ ДЛЯ ШЫМКЕНТА', 'ШЫМКЕНТ ҮШІН БІРГЕ')}</span>
          <h2>{t('Пусть каждый\nкилометр помогает.', 'Әр шақырым\nкөмекке айналсын.')}</h2>
          <p>
            {t(
              'Направь накопленные баллы на проект, который тебе близок. Вместе мы делаем город теплее.',
              'Жинаған ұпайларыңды өзіңе жақын жобаға арна. Біз бірге қаланы мейірімді етеміз.',
            )}
          </p>
          <span className="charity-balance">
            <Sparkles size={18} />
            {t('Доступно', 'Қолжетімді')}:{' '}
            <strong>
              {state.balance} {t('баллов', 'ұпай')}
            </strong>
          </span>
        </div>
        <div className="charity-illustration">
          <span className="heart-halo" />
          <Heart size={120} strokeWidth={1} fill="currentColor" />
          <Leaf className="charity-leaf" size={65} />
        </div>
      </div>
      <SectionTitle title={t('Выбери своё доброе дело', 'Өз игі ісіңді таңда')} />
      <div className="charity-grid">
        {charities.map((p) => {
          const added = state.donations
            .filter((d) => d.projectId === p.id)
            .reduce((s, d) => s + d.amount, 0);
          return (
            <article className="card charity-card" key={p.id}>
              <span className={`charity-icon ${p.id}`}>
                <Icon name={p.icon} size={30} />
              </span>
              <h2>{l(p.title)}</h2>
              <p>{l(p.desc)}</p>
              <Progress value={p.raised + added} max={p.target} />
              <div className="charity-progress">
                <strong>
                  {(p.raised + added).toLocaleString()} <small>{t('баллов', 'ұпай')}</small>
                </strong>
                <span>
                  {t('из', '/')} {p.target.toLocaleString()}
                </span>
              </div>
              <button
                className="button outline full"
                onClick={() => {
                  setAmount(50);
                  setSelected(p);
                }}
              >
                <Heart size={17} />
                {t('Поддержать', 'Қолдау')}
              </button>
            </article>
          );
        })}
      </div>
      <div className="notice">
        <Leaf size={19} />
        {t(
          'Демонстрация благотворительного механизма: используются только виртуальные баллы. Указанные сборы — примеры, денежные переводы не выполняются.',
          'Қайырымдылық тетігінің демонстрациясы: тек виртуалды ұпайлар қолданылады. Көрсетілген жинақтар — мысалдар, ақша аударылмайды.',
        )}
      </div>
      {state.donations.length > 0 && (
        <>
          <SectionTitle title={t('Твои добрые дела', 'Сенің игі істерің')} />
          <div className="card donation-history">
            {state.donations.map((d) => (
              <div key={d.id}>
                <span className="icon-tile">
                  <Heart size={19} />
                </span>
                <span>
                  <strong>{l(charities.find((p) => p.id === d.projectId)!.title)}</strong>
                  <small>
                    {new Date(d.date).toLocaleDateString(state.lang === 'ru' ? 'ru' : 'kk')}
                  </small>
                </span>
                <strong>
                  −{d.amount} <small>{t('баллов', 'ұпай')}</small>
                </strong>
              </div>
            ))}
          </div>
        </>
      )}
      {selected && (
        <Modal
          title={t('Маленький вклад. Большое добро.', 'Кішкентай үлес. Үлкен жақсылық.')}
          onClose={close}
        >
          <div className="donation-modal">
            <span className="finish-medal">
              <Heart size={38} />
            </span>
            <h3>{l(selected.title)}</h3>
            <p>
              {t(
                'Сколько виртуальных баллов направим проекту?',
                'Жобаға қанша виртуалды ұпай жібереміз?',
              )}
            </p>
            <div className="amount-choices">
              {[50, 100, 200].map((n) => (
                <button
                  key={n}
                  className={amount === n ? 'active' : ''}
                  onClick={() => setAmount(n)}
                >
                  {n}
                </button>
              ))}
            </div>
            <label className="field">
              <span>{t('Или укажи свою сумму баллов', 'Немесе ұпай санын енгіз')}</span>
              <input
                type="number"
                min="1"
                max={state.balance}
                step="1"
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </label>
            <p className="microcopy">
              {t('Доступно', 'Қолжетімді')}: {state.balance} {t('баллов', 'ұпай')}
            </p>
            <button
              className="button primary full"
              disabled={amount <= 0 || amount > state.balance || !Number.isInteger(amount)}
              onClick={() => {
                dispatch({
                  type: 'donate',
                  projectId: selected.id,
                  amount,
                  id: crypto.randomUUID(),
                });
                setSelected(null);
                notify(
                  t(
                    `Спасибо! ${amount} виртуальных баллов направлено на доброе дело.`,
                    `Рақмет! ${amount} виртуалды ұпай игі іске жіберілді.`,
                  ),
                );
              }}
            >
              <Heart size={17} />
              {t('Передать баллы', 'Ұпайларды жіберу')}
            </button>
            {amount > state.balance && (
              <p className="form-error">
                {t('На балансе недостаточно баллов.', 'Баланста ұпай жеткіліксіз.')}
              </p>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
