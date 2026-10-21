import { describe, expect, it } from 'vitest';
import { challengeProgress, dateKey, initialState, reducer, type Run } from './store';
const run: Run = {
  id: 'new-run',
  date: new Date().toISOString(),
  distance: 2.5,
  seconds: 900,
  activity: 0,
  routeId: 'independence',
  points: 999,
};
describe('demo economy and persisted progress', () => {
  it('awards exactly ten points per kilometer and ignores duplicate finish events', () => {
    const s = initialState();
    const next = reducer(s, { type: 'run', run });
    expect(next.balance).toBe(205);
    expect(next.runs[0].points).toBe(25);
    expect(next.earned).toBe(205);
    expect(reducer(next, { type: 'run', run })).toBe(next);
  });
  it('counts only training completed after joining and grants a reward once', () => {
    let s = reducer(initialState(), { type: 'join', id: 'first' });
    expect(challengeProgress(s, 'first')).toBe(0);
    expect(reducer(s, { type: 'claim', id: 'first' })).toBe(s);
    s = reducer(s, { type: 'run', run });
    expect(challengeProgress(s, 'first')).toBe(1);
    s = reducer(s, { type: 'claim', id: 'first' });
    expect(s.balance).toBe(235);
    expect(reducer(s, { type: 'claim', id: 'first' })).toBe(s);
  });
  it('does not allow coupon duplication, overdrafts or reducing earned ranking points', () => {
    let s = reducer(initialState(), {
      type: 'redeem',
      partnerId: 'magnum',
      cost: 50,
      id: 'coupon-1',
    });
    expect(s.balance).toBe(130);
    expect(s.earned).toBe(180);
    expect(reducer(s, { type: 'redeem', partnerId: 'magnum', cost: 50, id: 'coupon-2' })).toBe(s);
    expect(reducer(s, { type: 'redeem', partnerId: 'puma', cost: 200, id: 'coupon-3' })).toBe(s);
  });
  it('records donations and rejects negative, fractional and excessive amounts', () => {
    let s = initialState();
    for (const amount of [-50, 0, 0.5, 181, NaN])
      expect(reducer(s, { type: 'donate', projectId: 'kids', amount, id: 'd' })).toBe(s);
    s = reducer(s, { type: 'donate', projectId: 'kids', amount: 100, id: 'd' });
    expect(s.balance).toBe(80);
    expect(s.donations).toHaveLength(1);
    expect(s.earned).toBe(180);
    expect(reducer(s, { type: 'donate', projectId: 'kids', amount: 50, id: 'd' })).toBe(s);
  });
  it('starts fresh water tracking on a new local date without going negative', () => {
    const old = { ...initialState(), water: { date: '2000-01-01', ml: 1750 } };
    const s = reducer(old, { type: 'water', amount: 250 });
    expect(s.water).toEqual({ date: dateKey(), ml: 250 });
    expect(reducer(s, { type: 'water', amount: -500 }).water.ml).toBe(0);
  });
  it('resets all demo activity and keeps the selected language', () => {
    const s = reducer(
      { ...initialState(), lang: 'kk', balance: 0, events: ['morning'] },
      { type: 'reset' },
    );
    expect(s.lang).toBe('kk');
    expect(s.entered).toBe(false);
    expect(s.balance).toBe(180);
    expect(s.events).toEqual([]);
  });
});
