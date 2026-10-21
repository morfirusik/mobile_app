import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Activity,
  ArrowRight,
  Bell,
  BookOpen,
  Check,
  ChevronRight,
  Droplets,
  Dumbbell,
  Edit3,
  Footprints,
  Heart,
  Leaf,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  RotateCcw,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  User,
  Utensils,
  X,
} from 'lucide-react';
import { activityNames, bi, categories, foods, type LocalText } from '../data';
import { dateKey, totalKm, type Profile } from '../store';
import {
  Achievement,
  Badge,
  Empty,
  ListLink,
  Modal,
  PageHeading,
  Progress,
  SectionTitle,
  useApp,
} from '../ui';

export function HealthScreen() {
  const { state, dispatch, t, l } = useApp();
  const [tab, setTab] = useState('food');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [selected, setSelected] = useState<(typeof foods)[number] | null>(null);
  const [grams, setGrams] = useState(100);
  const close = useCallback(() => setSelected(null), []);
  const water = state.water.date === dateKey() ? state.water.ml : 0;
  const warmup = [
    bi('Спокойная ходьба — 2 минуты', 'Баяу жүру — 2 минут'),
    bi('Круговые движения плечами и руками — 1 минута', 'Иық пен қолды айналдыру — 1 минут'),
    bi(
      'Мягкие движения стопами и коленями — 1 минута',
      'Тобық пен тізені жұмсақ қозғалту — 1 минут',
    ),
    bi(
      'Лёгкий бег с постепенным ускорением — 2 минуты',
      'Біртіндеп жылдамдатып жеңіл жүгіру — 2 минут',
    ),
  ];
  return (
    <>
      <PageHeading
        title={t('Забота начинается с тебя', 'Қамқорлық өзіңнен басталады')}
        subtitle={t(
          'Вода, питание и немного внимания к своему телу.',
          'Су, тамақтану және денеңе аздап көңіл бөлу.',
        )}
      />
      <section className="hydration-card">
        <div className="hydration-copy">
          <span className="eyebrow">
            <Droplets size={16} />
            {t('ВОДНЫЙ БАЛАНС', 'СУ ТЕҢГЕРІМІ')}
          </span>
          <h2>
            {water >= state.waterGoal
              ? t('Цель на сегодня достигнута', 'Бүгінгі мақсатқа жеттің')
              : t('Не забудь сделать глоток', 'Бір жұтым су ішуді ұмытпа')}
          </h2>
          <p>
            {t(
              'Небольшая привычка, которая помогает заботиться о себе.',
              'Өзіңе қамқор болуға көмектесетін кішкентай әдет.',
            )}
          </p>
          <div className="water-total">
            <strong>
              {water}
              <small>
                {' '}
                / {state.waterGoal} {t('мл', 'мл')}
              </small>
            </strong>
            <Badge kind="blue">{Math.round((water / state.waterGoal) * 100)}%</Badge>
          </div>
          <Progress value={water} max={state.waterGoal} className="blue-progress" />
          <div className="water-actions">
            <button
              className="button water-button"
              onClick={() => dispatch({ type: 'water', amount: 250 })}
            >
              <Plus size={17} />
              {t('Стакан воды · 250 мл', 'Бір стақан су · 250 мл')}
            </button>
            <button
              className="icon-button"
              disabled={water === 0}
              onClick={() => dispatch({ type: 'water', amount: -250 })}
              aria-label={t('Убрать 250 мл', '250 мл азайту')}
            >
              <Minus size={18} />
            </button>
          </div>
        </div>
        <div className="water-visual">
          <div className="water-glass">
            <div style={{ height: `${Math.min(92, (water / state.waterGoal) * 92)}%` }} />
            <Droplets size={37} />
          </div>
          <span>{t('СЕГОДНЯ', 'БҮГІН')}</span>
        </div>
      </section>
      <div className="tabs page-tabs">
        {[
          ['food', 'Питание', 'Тамақтану'],
          ['warmup', 'Разминка', 'Қыздыру'],
          ['tips', 'Советы', 'Кеңестер'],
        ].map(([id, ru, kk]) => (
          <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>
            {t(ru, kk)}
          </button>
        ))}
      </div>
      {tab === 'food' && (
        <>
          <SectionTitle
            title={t('Что на твоей тарелке?', 'Тәрелкеңде не бар?')}
            eyebrow={t('СПРАВОЧНИК ПРОДУКТОВ', 'ТАҒАМ АНЫҚТАМАЛЫҒЫ')}
          />
          <div className="toolbar">
            <label className="search-field">
              <Utensils size={18} />
              <input
                placeholder={t('Найти продукт', 'Тағамды табу')}
                aria-label={t('Найти продукт', 'Тағамды табу')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
            <div className="filter-pills">
              {[
                ['all', 'Все', 'Барлығы'],
                ['fruit', 'Фрукты', 'Жемістер'],
                ['grain', 'Крупы', 'Жармалар'],
                ['protein', 'Белок', 'Ақуыз'],
                ['nuts', 'Орехи', 'Жаңғақтар'],
              ].map(([id, ru, kk]) => (
                <button
                  key={id}
                  className={category === id ? 'active' : ''}
                  onClick={() => setCategory(id)}
                >
                  {t(ru, kk)}
                </button>
              ))}
            </div>
          </div>
          <div className="food-grid">
            {foods
              .filter(
                (f) =>
                  (category === 'all' || f.category === category) &&
                  l(f.name).toLowerCase().includes(search.toLowerCase()),
              )
              .map((f) => (
                <button
                  className="card food-card"
                  key={f.name.ru}
                  onClick={() => {
                    setGrams(100);
                    setSelected(f);
                  }}
                >
                  <span className="food-emoji">{f.emoji}</span>
                  <span>
                    <strong>{l(f.name)}</strong>
                    <small>{t('На 100 г', '100 г үшін')}</small>
                  </span>
                  <span className="food-energy">
                    <strong>{f.kcal}</strong>
                    <small>{t('ккал', 'ккал')}</small>
                  </span>
                  <ChevronRight size={16} />
                </button>
              ))}
          </div>
          {!foods.some(
            (f) =>
              (category === 'all' || f.category === category) &&
              l(f.name).toLowerCase().includes(search.toLowerCase()),
          ) && (
            <Empty
              title={t('Продукт не найден', 'Тағам табылмады')}
              description={t(
                'Попробуй изменить поиск или категорию.',
                'Іздеуді немесе санатты өзгерт.',
              )}
            />
          )}
          <div className="notice">
            <BookOpen size={18} />
            {t(
              'Значения ориентировочные: состав зависит от продукта и приготовления. Нажми на продукт, чтобы рассчитать порцию.',
              'Мәндер шамамен берілген: құрамы тағам мен дайындалуына байланысты. Үлесті есептеу үшін тағамды бас.',
            )}
          </div>
        </>
      )}
      {tab === 'warmup' && (
        <div className="warmup-layout">
          <section className="card warmup-card">
            <span className="icon-tile large">
              <Dumbbell size={30} />
            </span>
            <h2>{t('6 минут для хорошего старта', 'Жақсы бастау үшін 6 минут')}</h2>
            <p>
              {t(
                'Двигайся плавно, в комфортном диапазоне и без боли.',
                'Жайлап, өзіңе жайлы аралықта және ауырсынусыз қозғал.',
              )}
            </p>
            {warmup.map((w, i) => (
              <div className="warmup-step" key={i}>
                <span>{i + 1}</span>
                <strong>{l(w)}</strong>
              </div>
            ))}
          </section>
          <section className="card tip-card">
            <Heart size={34} />
            <h2>{t('После тренировки', 'Жаттығудан кейін')}</h2>
            <p>
              {t(
                'Переходи на спокойную ходьбу на несколько минут. Дай дыханию восстановиться и выпей воды по жажде.',
                'Бірнеше минут баяу жүр. Тынысыңды қалпына келтіріп, шөлдегенде су іш.',
              )}
            </p>
            <p>
              {t(
                'При боли, головокружении или плохом самочувствии остановись.',
                'Ауырсыну, бас айналу немесе жайсыздық болса, тоқта.',
              )}
            </p>
          </section>
        </div>
      )}
      {tab === 'tips' && (
        <div className="tips-grid">
          {[
            {
              icon: Footprints,
              title: bi('Начинай с комфортного', 'Ыңғайлы қарқыннан баста'),
              body: bi(
                'Чередуй бег и ходьбу. Увеличивай нагрузку постепенно, оставляя время на восстановление.',
                'Жүгіру мен жүруді кезектестір. Қалпына келуге уақыт қалдырып, жүктемені біртіндеп арттыр.',
              ),
            },
            {
              icon: Droplets,
              title: bi('Прислушивайся к жажде', 'Шөліңе назар аудар'),
              body: bi(
                'Цель воды в приложении — настраиваемый ориентир, а не медицинская норма. Потребность зависит от погоды, активности и состояния здоровья.',
                'Қолданбадағы су мақсаты — медициналық норма емес, реттелетін бағдар. Қажеттілік ауа райына, белсенділікке және денсаулыққа байланысты.',
              ),
            },
            {
              icon: Utensils,
              title: bi('Разнообразие на тарелке', 'Тәрелкедегі әртүрлілік'),
              body: bi(
                'Добавляй в рацион овощи, фрукты, источники белка и цельные злаки. Перед бегом выбирай привычную еду.',
                'Рационға көкөністер, жемістер, ақуыз көздері және тұтас дәндер қос. Жүгіру алдында үйреншікті тағамды таңда.',
              ),
            },
            {
              icon: Leaf,
              title: bi('Отдых тоже часть прогресса', 'Демалыс та ілгерілеудің бөлігі'),
              body: bi(
                'Старайся соблюдать режим сна и чередовать активные дни со спокойными прогулками.',
                'Ұйқы режимін сақтап, белсенді күндерді тыныш серуендермен кезектестір.',
              ),
            },
          ].map((c) => (
            <section className="card tip-card" key={c.title.ru}>
              <c.icon size={29} />
              <h2>{l(c.title)}</h2>
              <p>{l(c.body)}</p>
            </section>
          ))}
        </div>
      )}
      {selected && (
        <Modal title={l(selected.name)} onClose={close}>
          <div className="food-detail">
            <span className="food-emoji">{selected.emoji}</span>
            <label className="field">
              <span>{t('Размер порции, г', 'Үлес мөлшері, г')}</span>
              <input
                type="number"
                min="1"
                max="2000"
                value={grams || ''}
                onChange={(e) => setGrams(Math.min(2000, Math.max(0, Number(e.target.value))))}
              />
            </label>
            <div className="food-calories">
              <strong>{Math.round((selected.kcal * grams) / 100)}</strong>
              <span>{t('ккал в порции', 'үлестегі ккал')}</span>
            </div>
            <div className="nutrition-macros">
              {[
                [t('Белки', 'Ақуыздар'), selected.protein],
                [t('Жиры', 'Майлар'), selected.fat],
                [t('Углеводы', 'Көмірсулар'), selected.carbs],
              ].map(([label, value]) => (
                <div key={label}>
                  <strong>
                    {((Number(value) * grams) / 100).toFixed(1)} {t('г', 'г')}
                  </strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <p className="microcopy">
              {t(
                'Справочная оценка, не индивидуальная рекомендация по питанию.',
                'Анықтамалық бағалау, жеке тамақтану ұсынысы емес.',
              )}
            </p>
          </div>
        </Modal>
      )}
    </>
  );
}

type ChatMessage = { id: string; who: 'user' | 'assistant'; text: LocalText | string };
export function AssistantScreen() {
  const { state, t, l } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottom = useRef<HTMLDivElement>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timeout.current), []);
  useEffect(() => {
    if (messages.length) bottom.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, typing]);
  const respond = (text: string, topic?: string) => {
    if (typing || !text.trim()) return;
    setInput('');
    setMessages((m) => [...m, { id: crypto.randomUUID(), who: 'user', text: text.trim() }]);
    setTyping(true);
    const q = text.toLowerCase();
    let answer: LocalText;
    if (topic === 'plan' || /план|тренир|жүгі|жаттығ|бег/.test(q))
      answer = bi(
        'Начнём спокойно 🌿\n\n1. Разминка: 5–6 минут лёгкой ходьбы.\n2. Чередуй 1 минуту бега и 2 минуты ходьбы, 5 раз.\n3. Заверши 3 минутами спокойной ходьбы.\n\nВыбирай темп, в котором можешь разговаривать. Это пример общего плана, а не персональная медицинская рекомендация.',
        'Жайлап бастайық 🌿\n\n1. Қыздыру: 5–6 минут жеңіл жүру.\n2. 1 минут жүгіру мен 2 минут жүруді 5 рет кезектестір.\n3. 3 минут баяу жүрумен аяқта.\n\nСөйлесе алатындай қарқынды таңда. Бұл жеке медициналық ұсыныс емес, жалпы жоспардың мысалы.',
      );
    else if (topic === 'food' || /питан|еда|калор|тамақ|тағам/.test(q))
      answer = bi(
        'Простой ориентир для тарелки 🥗\n\nДобавь овощи, источник белка и привычный гарнир. Перед тренировкой избегай экспериментов с едой.\n\nВ разделе «Здоровье и питание» можно посмотреть калорийность и рассчитать состав порции.',
        'Тәрелкеге арналған қарапайым бағдар 🥗\n\nКөкөністер, ақуыз көзі және үйреншікті гарнир қос. Жаттығу алдында жаңа тағамдарды сынама.\n\n«Денсаулық пен тамақтану» бөлімінде калория мен үлес құрамын есептеуге болады.',
      );
    else if (topic === 'progress' || /результ|статист|прогресс|нәтиже|жетістік/.test(q))
      answer = bi(
        `У тебя уже ${state.runs.length} тренировки и ${totalKm(state).toFixed(1)} км! ✨\n\nВсего заработано ${state.earned} баллов. На балансе осталось ${state.balance}.\n\nПродолжай в комфортном темпе. Вступи в челлендж перед следующей тренировкой, чтобы новые километры принесли дополнительную награду.`,
        `Сенде ${state.runs.length} жаттығу және ${totalKm(state).toFixed(1)} км бар! ✨\n\nБарлығы ${state.earned} ұпай жиналды. Баланста ${state.balance} қалды.\n\nЫңғайлы қарқынмен жалғастыр. Жаңа шақырымдар қосымша сыйлық әкелуі үшін келесі жаттығуға дейін челленджге қосыл.`,
      );
    else if (topic === 'route' || /маршрут|парк|бағыт|саябақ/.test(q))
      answer = bi(
        'Для лёгкого старта — Парк Независимости 🌳\n\nВ нашем демо маршрут составляет 2,5 км. Для более долгой прогулки есть Дендропарк — 5 км.\n\nОткрой «Маршруты», посмотри схему и выбери подходящий вариант. Перед реальным выходом проверь доступность дорожек.',
        'Жеңіл бастау үшін — Тәуелсіздік саябағы 🌳\n\nДемодағы бағыт — 2,5 км. Ұзағырақ серуенге Дендросаябақ бар — 5 км.\n\n«Бағыттар» бөлімін ашып, сызбаны қарап, өзіңе сай нұсқаны таңда. Нақты серуен алдында жолдардың қолжетімділігін тексер.',
      );
    else if (topic === 'water' || /вод|пить|іш|су\b/.test(q))
      answer = bi(
        'Время небольшого перерыва 💧\n\nПей по жажде и отмечай воду в разделе здоровья. Один стакан в приложении — 250 мл.\n\nДневную цель можно изменить в настройках. Это личный ориентир, а не медицинская норма.',
        'Кішкене үзіліс уақыты 💧\n\nШөлдегенде су ішіп, денсаулық бөлімінде белгіле. Қолданбадағы бір стақан — 250 мл.\n\nКүндік мақсатты баптауларда өзгертуге болады. Бұл медициналық норма емес, жеке бағдар.',
      );
    else
      answer = bi(
        'Я демонстрационный помощник Shymkent Run ✨\n\nМогу показать пример плана тренировки, советы по питанию, твои результаты, маршруты и напоминание о воде. Выбери тему ниже или напиши, например: «Покажи мои результаты».',
        'Мен Shymkent Run демо көмекшісімін ✨\n\nЖаттығу жоспарының мысалын, тамақтану кеңестерін, нәтижелеріңді, бағыттар мен су туралы еске салуды көрсете аламын. Төмендегі тақырыпты таңда немесе «Нәтижелерімді көрсет» деп жаз.',
      );
    timeout.current = setTimeout(() => {
      setMessages((m) => [...m, { id: crypto.randomUUID(), who: 'assistant', text: answer }]);
      setTyping(false);
    }, 650);
  };
  const topics = [
    {
      id: 'plan',
      icon: CalendarIcon,
      title: bi('План тренировки', 'Жаттығу жоспары'),
      desc: bi('Начнём с комфортного темпа', 'Ыңғайлы қарқыннан бастайық'),
    },
    {
      id: 'food',
      icon: Utensils,
      title: bi('Советы по питанию', 'Тамақтану кеңестері'),
      desc: bi('Простые привычки на каждый день', 'Күнделікті қарапайым әдеттер'),
    },
    {
      id: 'progress',
      icon: Activity,
      title: bi('Мои результаты', 'Менің нәтижелерім'),
      desc: bi('Посмотрим, как ты продвигаешься', 'Ілгерілеуіңді қарайық'),
    },
    {
      id: 'route',
      icon: MapPin,
      title: bi('Куда отправиться?', 'Қайда барамыз?'),
      desc: bi('Маршрут под твоё настроение', 'Көңіл күйіңе сай бағыт'),
    },
    {
      id: 'water',
      icon: Droplets,
      title: bi('Время для воды', 'Су ішетін уақыт'),
      desc: bi('Небольшой глоток заботы', 'Қамқорлықтың кішкентай жұтымы'),
    },
  ];
  return (
    <>
      <PageHeading
        title={t('Рядом на каждом шаге', 'Әр қадамда қасыңда')}
        subtitle={t(
          'Твой помощник для движения и хороших привычек.',
          'Қозғалыс пен жақсы әдеттерге арналған көмекшің.',
        )}
        action={
          <Badge>
            <Sparkles size={13} />
            {t('Демо-ассистент', 'Демо көмекші')}
          </Badge>
        }
      />
      <div className="assistant-layout">
        <section className="card chat-card">
          <div className="chat-top">
            <span className="assistant-symbol">
              <Sparkles size={25} />
            </span>
            <div>
              <strong>Run Assistant</strong>
              <small>
                <span className="status-dot" />
                {t('Готов помочь', 'Көмектесуге дайын')}
              </small>
            </div>
            {messages.length > 0 && (
              <button
                className="icon-button"
                aria-label={t('Очистить чат', 'Чатты тазалау')}
                disabled={typing}
                onClick={() => setMessages([])}
              >
                <RotateCcw size={18} />
              </button>
            )}
          </div>
          <div className="chat-messages" aria-live="polite">
            <div className="chat-welcome">
              <span className="assistant-large">
                <Sparkles size={36} />
              </span>
              <h2>
                {t('Привет', 'Сәлем')}, {state.profile.name.split(' ')[0]}!
              </h2>
              <p>
                {t(
                  'Давай сделаем сегодняшний день чуть активнее. С чего начнём?',
                  'Бүгінгі күнді сәл белсендірек өткізейік. Неден бастаймыз?',
                )}
              </p>
            </div>
            {messages.map((m) => (
              <div key={m.id} className={`chat-bubble ${m.who}`}>
                {typeof m.text === 'string' ? m.text : l(m.text)}
              </div>
            ))}
            {typing && (
              <div className="chat-bubble assistant typing">
                <i />
                <i />
                <i />
                <span className="sr-only">{t('Готовлю ответ', 'Жауап дайындаудамын')}</span>
              </div>
            )}
            <div ref={bottom} />
          </div>
          <form
            className="chat-form"
            onSubmit={(e) => {
              e.preventDefault();
              respond(input);
            }}
          >
            <input
              maxLength={500}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('Напиши свой вопрос…', 'Сұрағыңды жаз…')}
              aria-label={t('Сообщение ассистенту', 'Көмекшіге хабарлама')}
            />
            <button disabled={!input.trim() || typing} aria-label={t('Отправить', 'Жіберу')}>
              <Send size={19} />
            </button>
          </form>
          <p className="chat-disclaimer">
            {t(
              'Подготовленные ответы для презентации. Не медицинская консультация.',
              'Презентацияға арналған дайын жауаптар. Медициналық кеңес емес.',
            )}
          </p>
        </section>
        <aside className="assistant-topics">
          <SectionTitle title={t('О чём поговорим?', 'Не туралы сөйлесеміз?')} />
          {topics.map((topic) => (
            <button
              className="topic-card"
              key={topic.id}
              disabled={typing}
              onClick={() => respond(l(topic.title), topic.id)}
            >
              <span className="icon-tile">
                <topic.icon size={21} />
              </span>
              <span>
                <strong>{l(topic.title)}</strong>
                <small>{l(topic.desc)}</small>
              </span>
              <ChevronRight size={16} />
            </button>
          ))}
          <div className="notice">
            <Leaf size={20} />
            {t(
              'Твой лучший темп — тот, в котором тебе хорошо.',
              'Өзіңді жақсы сезінетін қарқын — сенің ең жақсы қарқының.',
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
function CalendarIcon({ size = 20 }: { size?: number }) {
  return <Dumbbell size={size} />;
}

export function ProfileScreen() {
  const { state, dispatch, t, l, navigate, notify } = useApp();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<Profile>(state.profile);
  const close = useCallback(() => setEditing(false), []);
  const update = (field: keyof Profile, value: string | number) =>
    setProfile((p) => ({ ...p, [field]: value }));
  return (
    <>
      <PageHeading
        title={t('Твоё пространство', 'Сенің кеңістігің')}
        subtitle={t('Здесь начинается твой собственный ритм.', 'Өз ырғағың осы жерден басталады.')}
        action={
          <button
            className="icon-button bordered"
            aria-label={t('Настройки', 'Баптаулар')}
            onClick={() => navigate('settings')}
          >
            <Settings size={21} />
          </button>
        }
      />
      <div className="profile-layout">
        <section className="card profile-card">
          <div className="profile-cover">
            <span />
            <span />
            <Footprints size={90} />
          </div>
          <span className="profile-avatar">{state.profile.name.slice(0, 1)}</span>
          <div className="profile-intro">
            <h2>{state.profile.name}</h2>
            <Badge>
              <span className="status-dot" />
              {t('В своём ритме', 'Өз ырғағында')}
            </Badge>
            <p>{l(categories[state.profile.category])}</p>
            <span className="profile-city">
              <MapPin size={15} />
              {state.profile.city}
            </span>
          </div>
          <div className="profile-metrics">
            <div>
              <strong>{state.profile.age}</strong>
              <span>{t('возраст', 'жас')}</span>
            </div>
            <div>
              <strong>
                {state.profile.height} <small>{t('см', 'см')}</small>
              </strong>
              <span>{t('рост', 'бой')}</span>
            </div>
            <div>
              <strong>
                {state.profile.weight} <small>{t('кг', 'кг')}</small>
              </strong>
              <span>{t('вес', 'салмақ')}</span>
            </div>
          </div>
          <button
            className="button outline full"
            onClick={() => {
              setProfile({ ...state.profile });
              setEditing(true);
            }}
          >
            <Edit3 size={17} />
            {t('Редактировать профиль', 'Профильді өңдеу')}
          </button>
          <div className="profile-local-note">
            <ShieldCheck size={16} />
            {t('Демо-профиль на этом устройстве', 'Осы құрылғыдағы демо профиль')}
          </div>
        </section>
        <div className="profile-right">
          <section className="card profile-achievements">
            <SectionTitle
              title={t('Маленькие победы', 'Кішкентай жеңістер')}
              action={t('Все', 'Барлығы')}
              onClick={() => navigate('challenges')}
            />
            <div className="achievement-row">
              <Achievement
                icon="foot"
                title={t('Первый шаг', 'Алғашқы қадам')}
                unlocked={state.runs.length > 0}
              />
              <Achievement
                icon="flag"
                title={t('5 километров', '5 шақырым')}
                unlocked={totalKm(state) >= 5}
              />
              <Achievement
                icon="heart"
                title={t('Доброе сердце', 'Мейірімді жүрек')}
                unlocked={state.donations.length > 0}
              />
              <Achievement
                icon="people"
                title={t('В команде', 'Командада')}
                unlocked={state.events.length > 0}
              />
            </div>
          </section>
          <section className="card profile-links">
            <ListLink
              icon={<Activity size={20} />}
              title={t('Моя активность', 'Менің белсенділігім')}
              subtitle={t(
                `${state.runs.length} тренировки · ${totalKm(state).toFixed(1)} км`,
                `${state.runs.length} жаттығу · ${totalKm(state).toFixed(1)} км`,
              )}
              onClick={() => navigate('statistics')}
            />
            <ListLink
              icon={<Trophy size={20} />}
              title={t('Челленджи и рейтинг', 'Челлендждер мен рейтинг')}
              subtitle={t('Новые цели и твои достижения', 'Жаңа мақсаттар мен жетістіктерің')}
              onClick={() => navigate('challenges')}
            />
            <ListLink
              icon={<Sparkles size={20} />}
              title={t('Мои баллы и бонусы', 'Ұпайларым мен бонустарым')}
              subtitle={`${state.balance} ${t('баллов доступно', 'ұпай қолжетімді')}`}
              onClick={() => navigate('community')}
            />
            <ListLink
              icon={<Settings size={20} />}
              title={t('Настройки', 'Баптаулар')}
              subtitle={t('Язык, цели и напоминания', 'Тіл, мақсаттар және еске салулар')}
              onClick={() => navigate('settings')}
            />
          </section>
          <div className="profile-motto">
            <Leaf size={23} />
            <span>
              {t(
                'Не сравнивай свой путь с чужим.\nКаждый твой шаг имеет значение.',
                'Өз жолыңды басқалармен салыстырма.\nӘр қадамың маңызды.',
              )}
            </span>
          </div>
        </div>
      </div>
      {editing && (
        <Modal title={t('Твой профиль', 'Сенің профилің')} onClose={close}>
          <form
            className="profile-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!profile.name.trim() || !profile.login.trim() || !profile.city.trim()) return;
              dispatch({
                type: 'profile',
                profile: {
                  ...profile,
                  name: profile.name.trim(),
                  login: profile.login.trim(),
                  city: profile.city.trim(),
                  phone: profile.phone.trim(),
                },
              });
              setEditing(false);
              notify(t('Профиль сохранён', 'Профиль сақталды'));
            }}
          >
            <label className="field">
              <span>{t('ФИО', 'Аты-жөні')}</span>
              <input
                required
                maxLength={70}
                value={profile.name}
                onChange={(e) => update('name', e.target.value)}
              />
            </label>
            <label className="field">
              <span>{t('Логин', 'Логин')}</span>
              <input
                required
                maxLength={30}
                pattern="[A-Za-z0-9_.-]+"
                title={t(
                  'Латинские буквы, цифры, точка, дефис или подчёркивание',
                  'Латын әріптері, сандар, нүкте, сызықша немесе астын сызу',
                )}
                value={profile.login}
                onChange={(e) => update('login', e.target.value)}
              />
            </label>
            <div className="form-row">
              {[
                { key: 'age', label: t('Возраст', 'Жасы'), min: 8, max: 110 },
                { key: 'height', label: t('Рост, см', 'Бойы, см'), min: 80, max: 250 },
                { key: 'weight', label: t('Вес, кг', 'Салмағы, кг'), min: 20, max: 300 },
              ].map((f) => (
                <label className="field" key={f.key}>
                  <span>{f.label}</span>
                  <input
                    required
                    type="number"
                    min={f.min}
                    max={f.max}
                    value={profile[f.key as 'age' | 'height' | 'weight'] || ''}
                    onChange={(e) => update(f.key as keyof Profile, Number(e.target.value))}
                  />
                </label>
              ))}
            </div>
            <label className="field">
              <span>{t('Город', 'Қала')}</span>
              <input
                required
                maxLength={50}
                value={profile.city}
                onChange={(e) => update('city', e.target.value)}
              />
            </label>
            <label className="field">
              <span>{t('Телефон · необязательно', 'Телефон · міндетті емес')}</span>
              <input
                type="tel"
                maxLength={25}
                placeholder="+7 (___) ___-__-__"
                value={profile.phone}
                onChange={(e) => update('phone', e.target.value)}
              />
            </label>
            <label className="field">
              <span>{t('Категория участника', 'Қатысушы санаты')}</span>
              <select
                value={profile.category}
                onChange={(e) => update('category', Number(e.target.value))}
              >
                {categories.map((c, i) => (
                  <option key={i} value={i}>
                    {l(c)}
                  </option>
                ))}
              </select>
            </label>
            <p className="microcopy">
              {t(
                'Для демонстрации достаточно вымышленных данных. Пароль не требуется, профиль хранится только в браузере.',
                'Демонстрация үшін ойдан шығарылған деректер жеткілікті. Құпиясөз қажет емес, профиль тек браузерде сақталады.',
              )}
            </p>
            <button className="button primary full" type="submit">
              <Check size={17} />
              {t('Сохранить изменения', 'Өзгерістерді сақтау')}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}

export function SettingsScreen() {
  const { state, dispatch, t, navigate, notify } = useApp();
  const [weekly, setWeekly] = useState(state.weeklyGoal);
  const [water, setWater] = useState(state.waterGoal);
  const [reminder, setReminder] = useState(state.reminder);
  const [reset, setReset] = useState(false);
  const close = useCallback(() => setReset(false), []);
  return (
    <>
      <PageHeading
        title={t('Настроено под тебя', 'Саған бейімделген')}
        subtitle={t(
          'Маленькие настройки для твоих больших планов.',
          'Үлкен жоспарларыңа арналған кішкентай баптаулар.',
        )}
      />
      <div className="settings-layout">
        <section className="card settings-card">
          <SectionTitle title={t('Язык приложения', 'Қолданба тілі')} />
          <div className="language-options">
            <button
              className={state.lang === 'ru' ? 'active' : ''}
              onClick={() => dispatch({ type: 'lang', lang: 'ru' })}
            >
              <span>
                Русский<small>Русский язык</small>
              </span>
              {state.lang === 'ru' && <Check size={20} />}
            </button>
            <button
              className={state.lang === 'kk' ? 'active' : ''}
              onClick={() => dispatch({ type: 'lang', lang: 'kk' })}
            >
              <span>
                Қазақша<small>Қазақ тілі</small>
              </span>
              {state.lang === 'kk' && <Check size={20} />}
            </button>
          </div>
        </section>
        <section className="card settings-card">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              dispatch({ type: 'settings', weeklyGoal: weekly, waterGoal: water, reminder });
              notify(t('Настройки сохранены', 'Баптаулар сақталды'));
            }}
          >
            <SectionTitle title={t('Цели и привычки', 'Мақсаттар мен әдеттер')} />
            <label className="field">
              <span>
                <Target size={17} />
                {t('Недельная цель, км', 'Апталық мақсат, км')}
              </span>
              <input
                required
                type="number"
                min="1"
                max="200"
                step="1"
                value={weekly || ''}
                onChange={(e) => setWeekly(Number(e.target.value))}
              />
            </label>
            <label className="field">
              <span>
                <Droplets size={17} />
                {t('Личная цель воды, мл в день', 'Жеке су мақсаты, күніне мл')}
              </span>
              <input
                required
                type="number"
                min="250"
                max="4000"
                step="250"
                value={water || ''}
                onChange={(e) => setWater(Number(e.target.value))}
              />
            </label>
            <label className="switch-row">
              <span>
                <strong>{t('Подсказка о воде', 'Су туралы кеңес')}</strong>
                <small>
                  {t('В центре уведомлений приложения', 'Қолданбаның хабарлама орталығында')}
                </small>
              </span>
              <input
                type="checkbox"
                checked={reminder}
                onChange={(e) => setReminder(e.target.checked)}
              />
              <span className="switch" />
            </label>
            <button className="button primary full" type="submit">
              {t('Сохранить настройки', 'Баптауларды сақтау')}
              <Check size={17} />
            </button>
          </form>
        </section>
        <section className="card settings-card">
          <SectionTitle title={t('Данные и демонстрация', 'Деректер мен демонстрация')} />
          <div className="privacy-note">
            <ShieldCheck size={25} />
            <p>
              {t(
                'Профиль, тренировки и баллы хранятся только в этом браузере. Очистка данных браузера удалит их. Серверной регистрации и синхронизации в этой версии нет.',
                'Профиль, жаттығулар мен ұпайлар тек осы браузерде сақталады. Браузер деректерін тазалау оларды жояды. Бұл нұсқада серверлік тіркелу мен синхрондау жоқ.',
              )}
            </p>
          </div>
          <button className="button danger-outline full" onClick={() => setReset(true)}>
            <RotateCcw size={17} />
            {t('Сбросить демо к началу', 'Демоны басына қайтару')}
          </button>
          <p className="microcopy">
            {t(
              'Удобно перед новым показом: вернутся стартовый профиль, 180 баллов и примеры тренировок.',
              'Жаңа көрсетілім алдында ыңғайлы: бастапқы профиль, 180 ұпай және жаттығу мысалдары қайтарылады.',
            )}
          </p>
        </section>
      </div>
      {reset && (
        <Modal
          title={t('Начать демонстрацию заново?', 'Демонстрацияны қайта бастау керек пе?')}
          onClose={close}
        >
          <p>
            {t(
              'Изменения профиля, новые тренировки, купоны и пожертвования будут удалены из этого браузера. Вернутся исходные примеры.',
              'Профиль өзгерістері, жаңа жаттығулар, купондар мен қайырымдылық жазбалары осы браузерден жойылады. Бастапқы мысалдар қайтарылады.',
            )}
          </p>
          <button
            className="button danger full"
            onClick={() => {
              dispatch({ type: 'reset' });
              setReset(false);
              navigate('home');
              notify(t('Демо готово к новому показу', 'Демо жаңа көрсетілімге дайын'));
            }}
          >
            {t('Да, сбросить демо', 'Иә, демоны қалпына келтіру')}
          </button>
          <button className="button outline full" onClick={close}>
            {t('Отмена', 'Бас тарту')}
          </button>
        </Modal>
      )}
    </>
  );
}
