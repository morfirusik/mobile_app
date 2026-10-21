import { expect, test, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
const enter = async (page: Page) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Войти в демо', exact: true }).click();
};
const nav = async (page: Page, name: string) => {
  await page.locator('.side-nav').getByRole('button', { name, exact: true }).click();
};
test('presentation journey: challenge → run → reward → coupon → charity → reload', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await enter(page);
  await nav(page, 'Челленджи и рейтинг');
  await page.getByRole('button', { name: 'Присоединиться', exact: true }).first().click();
  await nav(page, 'Маршруты');
  await page.getByRole('button', { name: 'Посмотреть маршрут' }).first().click();
  await page.getByRole('button', { name: 'Выбрать маршрут', exact: true }).click();
  await page.getByRole('button', { name: 'Начать демо-пробежку' }).click();
  await page.getByRole('button', { name: 'Пауза', exact: true }).click();
  await expect(page.getByText('На паузе', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Продолжить', exact: true }).click();
  await page.getByRole('button', { name: 'Показать финиш маршрута' }).click();
  await expect(page.getByRole('dialog')).toContainText('2,5');
  await expect(page.getByRole('dialog')).toContainText('+25');
  await page.getByRole('button', { name: 'К достижениям' }).click();
  await page.getByRole('button', { name: 'Забрать награду' }).click();
  await expect(page.getByText('Награда получена', { exact: true })).toBeVisible();
  await nav(page, 'Сообщество и партнёры');
  await page.locator('.partner-card').filter({ hasText: 'magnum' }).click();
  await page.getByRole('button', { name: 'Обменять баллы' }).click();
  await expect(page.locator('.coupon-code')).toContainText('SR-DEMO-');
  await page.getByRole('dialog').getByRole('button', { name: 'Закрыть', exact: true }).click();
  await nav(page, 'Добрые дела');
  await page.getByRole('button', { name: 'Поддержать', exact: true }).first().click();
  await page.getByRole('button', { name: 'Передать баллы' }).click();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('shymkent-run:v1')!));
  expect(saved.balance).toBe(135);
  expect(saved.earned).toBe(235);
  expect(saved.runs).toHaveLength(4);
  expect(saved.coupons).toHaveLength(1);
  expect(saved.donations).toHaveLength(1);
  await page.reload();
  await expect(page.getByRole('heading', { name: /Привет/ })).toBeVisible();
  await expect(page.locator('.stat-card').filter({ hasText: 'Твой баланс' })).toContainText('135');
  expect(errors).toEqual([]);
});
test('all pages, filters, nutrition calculator, profile and Kazakh locale', async ({ page }) => {
  await enter(page);
  await nav(page, 'Маршруты');
  await page.getByRole('textbox', { name: 'Поиск маршрута' }).fill('неизвестно');
  await expect(page.getByText('Маршрут не найден')).toBeVisible();
  await nav(page, 'Здоровье и питание');
  await page.getByRole('button', { name: 'Стакан воды · 250 мл' }).click();
  await expect(page.locator('.water-total')).toContainText('750');
  await page.locator('.food-card').filter({ hasText: 'Банан' }).click();
  await page.getByRole('spinbutton', { name: 'Размер порции, г' }).fill('200');
  await expect(page.locator('.food-calories')).toContainText('178');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Разминка', exact: true }).click();
  await expect(page.getByText('6 минут для хорошего старта')).toBeVisible();
  await nav(page, 'ИИ-ассистент');
  await page.getByRole('button', { name: /Мои результаты Посмотрим/ }).click();
  await expect(page.locator('.chat-bubble.assistant')).toContainText('8.6 км');
  await page.getByRole('button', { name: 'Профиль', exact: true }).click();
  await page.getByRole('button', { name: 'Редактировать профиль' }).click();
  await page.getByRole('textbox', { name: 'ФИО', exact: true }).fill('Айдана Т.');
  await page.getByRole('button', { name: 'Сохранить изменения' }).click();
  await expect(page.getByRole('heading', { name: 'Айдана Т.' })).toBeVisible();
  await page.getByRole('button', { name: 'Қазақша', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Сенің кеңістігің' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: /Сәлем, Айдана/ })).toBeVisible();
});
test('mobile navigation and pages never overflow horizontally', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enter(page);
  for (const name of ['Маршруты', 'Сообщество', 'Ассистент', 'Профиль', 'Главная']) {
    await page.locator('.bottom-nav').getByRole('button', { name, exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
  await page.getByRole('button', { name: 'Открыть меню' }).click();
  await nav(page, 'Челленджи и рейтинг');
  await page.getByRole('button', { name: 'Рейтинг', exact: true }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/mobile-rating.png', fullPage: true });
  await page.locator('.bottom-nav').getByRole('button', { name: 'Главная', exact: true }).click();
  await page.screenshot({ path: 'test-results/mobile-home.png', fullPage: true });
});
test('reset is confirmed, clears changes and allows a fresh presentation', async ({ page }) => {
  await enter(page);
  await page.getByRole('button', { name: 'Профиль', exact: true }).click();
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  await page.getByRole('spinbutton', { name: 'Недельная цель, км' }).fill('25');
  await page.getByRole('button', { name: 'Сохранить настройки' }).click();
  await page.getByRole('button', { name: 'Сбросить демо к началу' }).click();
  await page.getByRole('button', { name: 'Отмена', exact: true }).click();
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem('shymkent-run:v1')!).weeklyGoal),
  ).toBe(25);
  await page.getByRole('button', { name: 'Сбросить демо к началу' }).click();
  await page.getByRole('button', { name: 'Да, сбросить демо' }).click();
  await expect(page.getByRole('button', { name: 'Войти в демо' })).toBeVisible();
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem('shymkent-run:v1')!).weeklyGoal),
  ).toBe(15);
});
test('desktop home screenshot', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await enter(page);
  await page.screenshot({ path: 'test-results/desktop-home.png', fullPage: true });
});
test('standalone HTML completes a workout offline without external assets', async ({
  page,
  context,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  const html = await readFile('dist/Shymkent-Run.html', 'utf8');
  await page.route('http://127.0.0.1:5173/offline-demo', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: html,
    }),
  );
  await context.setOffline(true);
  // The managed cloud browser blocks file: URLs. Supply the unchanged standalone
  // document through Playwright's in-memory route, with the network offline.
  await page.goto('http://127.0.0.1:5173/offline-demo');
  await page.getByRole('button', { name: 'Войти в демо', exact: true }).click();
  await page.getByRole('button', { name: 'Начать тренировку', exact: true }).click();
  await page.getByRole('button', { name: 'Начать демо-пробежку' }).click();
  await page.getByRole('button', { name: 'Показать финиш маршрута' }).click();
  await expect(page.getByRole('dialog')).toContainText('+25');
  await page.getByRole('button', { name: 'Моя статистика', exact: true }).click();
  await expect(page.locator('.history-item')).toHaveCount(4);
  expect(errors).toEqual([]);
  expect(requests).toEqual(['http://127.0.0.1:5173/offline-demo']);
});
test('all mobile sections fit a 320px screen in Kazakh', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await enter(page);
  await page.getByRole('button', { name: 'Қазақша', exact: true }).click();
  for (const name of [
    'Бағыттар',
    'Белсенділігім',
    'Челлендждер мен рейтинг',
    'Денсаулық пен тамақтану',
    'Қауымдастық пен серіктестер',
    'Игі істер',
    'ЖИ көмекші',
  ]) {
    await page.getByRole('button', { name: 'Мәзірді ашу' }).click();
    await nav(page, name);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      name,
    ).toBe(true);
  }
});
