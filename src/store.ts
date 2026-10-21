import { challenges } from './data';
export interface Run {
  id: string;
  date: string;
  distance: number;
  seconds: number;
  activity: number;
  routeId: string;
  points: number;
}
export interface Profile {
  name: string;
  login: string;
  age: number;
  height: number;
  weight: number;
  city: string;
  phone: string;
  category: number;
}
export interface State {
  version: 1;
  entered: boolean;
  lang: 'ru' | 'kk';
  profile: Profile;
  balance: number;
  earned: number;
  runs: Run[];
  water: { date: string; ml: number };
  waterGoal: number;
  weeklyGoal: number;
  reminder: boolean;
  joined: Record<string, { baseline: number; claimed: boolean }>;
  coupons: { id: string; partnerId: string; code: string; date: string }[];
  donations: { id: string; projectId: string; amount: number; date: string }[];
  events: string[];
}
export const STORAGE_KEY = 'shymkent-run:v1';
export function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function initialState(): State {
  const ago = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    d.setHours(8, 30, 0, 0);
    return d.toISOString();
  };
  return {
    version: 1,
    entered: false,
    lang: 'ru',
    profile: {
      name: 'Нурдаулет А.',
      login: 'nurdaulet',
      age: 23,
      height: 178,
      weight: 75,
      city: 'Шымкент',
      phone: '',
      category: 2,
    },
    balance: 180,
    earned: 180,
    runs: [
      {
        id: 'seed-1',
        date: ago(0),
        distance: 2.4,
        seconds: 1020,
        activity: 0,
        routeId: 'independence',
        points: 24,
      },
      {
        id: 'seed-2',
        date: ago(2),
        distance: 3.2,
        seconds: 1440,
        activity: 0,
        routeId: 'dendro',
        points: 32,
      },
      {
        id: 'seed-3',
        date: ago(4),
        distance: 3,
        seconds: 2100,
        activity: 2,
        routeId: 'city',
        points: 30,
      },
    ],
    water: { date: dateKey(), ml: 500 },
    waterGoal: 2000,
    weeklyGoal: 15,
    reminder: true,
    joined: {},
    coupons: [],
    donations: [],
    events: [],
  };
}
export function loadState(): State {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (
      parsed?.version === 1 &&
      Array.isArray(parsed.runs) &&
      Array.isArray(parsed.coupons) &&
      Array.isArray(parsed.donations) &&
      parsed.profile &&
      typeof parsed.profile.name === 'string' &&
      ['ru', 'kk'].includes(parsed.lang) &&
      Number.isFinite(parsed.balance) &&
      parsed.balance >= 0 &&
      parsed.water &&
      parsed.joined
    )
      return { ...initialState(), ...parsed };
  } catch {
    /* Corrupt or unavailable storage falls back to a usable demo. */
  }
  return initialState();
}
export const totalKm = (s: State) => s.runs.reduce((sum, r) => sum + r.distance, 0);
export function challengeProgress(s: State, id: string) {
  const challenge = challenges.find((c) => c.id === id);
  const joined = s.joined[id];
  if (!challenge || !joined) return 0;
  return Math.min(
    challenge.target,
    Math.max(0, (challenge.unit === 'km' ? totalKm(s) : s.runs.length) - joined.baseline),
  );
}
export type Action =
  | { type: 'enter' }
  | { type: 'lang'; lang: State['lang'] }
  | { type: 'profile'; profile: Profile }
  | { type: 'run'; run: Run }
  | { type: 'water'; amount: number }
  | { type: 'settings'; waterGoal: number; weeklyGoal: number; reminder: boolean }
  | { type: 'join'; id: string }
  | { type: 'claim'; id: string }
  | { type: 'redeem'; partnerId: string; cost: number; id: string }
  | { type: 'donate'; projectId: string; amount: number; id: string }
  | { type: 'event'; id: string }
  | { type: 'reset' };
export function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'enter':
      return { ...s, entered: true };
    case 'lang':
      return { ...s, lang: a.lang };
    case 'profile':
      return { ...s, profile: a.profile };
    case 'run': {
      if (
        s.runs.some((r) => r.id === a.run.id) ||
        a.run.distance <= 0 ||
        !Number.isFinite(a.run.distance)
      )
        return s;
      const run = { ...a.run, points: Math.floor(a.run.distance * 10) };
      return {
        ...s,
        runs: [run, ...s.runs],
        balance: s.balance + run.points,
        earned: s.earned + run.points,
      };
    }
    case 'water':
      return {
        ...s,
        water: {
          date: dateKey(),
          ml: Math.max(0, Math.min(6000, (s.water.date === dateKey() ? s.water.ml : 0) + a.amount)),
        },
      };
    case 'settings':
      return { ...s, waterGoal: a.waterGoal, weeklyGoal: a.weeklyGoal, reminder: a.reminder };
    case 'event':
      return {
        ...s,
        events: s.events.includes(a.id)
          ? s.events.filter((id) => id !== a.id)
          : [...s.events, a.id],
      };
    case 'join': {
      const c = challenges.find((c) => c.id === a.id);
      if (!c || s.joined[a.id]) return s;
      return {
        ...s,
        joined: {
          ...s.joined,
          [a.id]: { baseline: c.unit === 'km' ? totalKm(s) : s.runs.length, claimed: false },
        },
      };
    }
    case 'claim': {
      const c = challenges.find((c) => c.id === a.id);
      if (
        !c ||
        !s.joined[a.id] ||
        s.joined[a.id].claimed ||
        challengeProgress(s, a.id) < c.target - 0.00001
      )
        return s;
      return {
        ...s,
        balance: s.balance + c.reward,
        earned: s.earned + c.reward,
        joined: { ...s.joined, [a.id]: { ...s.joined[a.id], claimed: true } },
      };
    }
    case 'redeem':
      if (a.cost <= 0 || s.balance < a.cost || s.coupons.some((c) => c.partnerId === a.partnerId))
        return s;
      return {
        ...s,
        balance: s.balance - a.cost,
        coupons: [
          {
            id: a.id,
            partnerId: a.partnerId,
            code: `SR-DEMO-${a.id.slice(0, 6).toUpperCase()}`,
            date: new Date().toISOString(),
          },
          ...s.coupons,
        ],
      };
    case 'donate':
      if (
        !Number.isFinite(a.amount) ||
        a.amount <= 0 ||
        !Number.isInteger(a.amount) ||
        s.balance < a.amount ||
        s.donations.some((d) => d.id === a.id)
      )
        return s;
      return {
        ...s,
        balance: s.balance - a.amount,
        donations: [
          { id: a.id, projectId: a.projectId, amount: a.amount, date: new Date().toISOString() },
          ...s.donations,
        ],
      };
    case 'reset':
      return { ...initialState(), lang: s.lang };
  }
}
