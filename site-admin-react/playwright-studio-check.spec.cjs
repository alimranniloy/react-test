const { test, expect } = require('playwright/test');
const SecureLS = require('/Users/dev/Desktop/frontend-dev/site/site-admin-react/node_modules/secure-ls');

const TOKEN =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjEzMzUwNiwiZXhwIjoxNzczNzQzNjk3LCJyb2xlIjozfQ.zbQNyuSjq1wl340qOQFB4-aohYJLqmTCdQn9YOuzZRg';
const SITE_ID = '15078';

const fakeStorage = {};
global.localStorage = {
  setItem: (key, value) => {
    fakeStorage[key] = value;
  },
  getItem: (key) => fakeStorage[key] ?? null,
  removeItem: (key) => {
    delete fakeStorage[key];
  },
};

const secureLs = new SecureLS({
  encryptionNamespace: 'site-admin-react',
  isCompression: true,
});

secureLs.set(
  'site-admin-react-auth',
  JSON.stringify({
    state: {
      token: TOKEN,
      user: {
        id: 133506,
        name: 'Demo Admin',
      },
      auth: true,
    },
    version: 1,
  })
);

const storageState = {
  cookies: [],
  origins: [
    {
      origin: 'http://127.0.0.1:5105',
      localStorage: [
        {
          name: 'BPONI-AUTH_site-admin',
          value: TOKEN,
        },
        {
          name: 'site-admin-react-auth',
          value: fakeStorage['site-admin-react-auth'],
        },
      ],
    },
  ],
};

test.use({
  channel: 'chrome',
  storageState,
  viewport: { width: 1600, height: 980 },
});

test('studio loads and AI sidebar opens', async ({ page }) => {
  const consoleLogs = [];
  page.on('console', (message) => {
    consoleLogs.push(`[console:${message.type()}] ${message.text()}`);
  });
  page.on('pageerror', (error) => {
    consoleLogs.push(`[pageerror] ${error.message}`);
  });

  await page.goto(`http://127.0.0.1:5105/studio/?siteId=${SITE_ID}`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  await page.waitForTimeout(8000);

  const snapshotBefore = {
    url: page.url(),
    title: await page.title(),
    body: (await page.locator('body').innerText()).slice(0, 3000),
    iframeCount: await page.locator('iframe').count(),
    hasMakeWithAI: await page
      .getByRole('button', { name: /make with ai/i })
      .isVisible()
      .catch(() => false),
    hasBackToAdmin: await page
      .getByText('Back to Admin Editor')
      .isVisible()
      .catch(() => false),
  };

  console.log('STUDIO_BEFORE');
  console.log(JSON.stringify(snapshotBefore, null, 2));
  console.log('STUDIO_LOGS_BEFORE');
  console.log(JSON.stringify(consoleLogs.slice(-20), null, 2));

  await expect(
    page.getByRole('button', { name: /make with ai/i })
  ).toBeVisible({
    timeout: 15000,
  });
  await page.getByRole('button', { name: /make with ai/i }).click();
  await expect(page.getByText('Live Theme Chat')).toBeVisible({
    timeout: 10000,
  });

  const snapshotAfter = {
    body: (await page.locator('body').innerText()).slice(0, 3500),
    chatVisible: await page.getByText('Live Theme Chat').isVisible(),
    inputVisible: await page
      .getByPlaceholder(/tell the ai exactly what to change/i)
      .isVisible()
      .catch(() => false),
    iframeCount: await page.locator('iframe').count(),
  };

  console.log('STUDIO_AFTER');
  console.log(JSON.stringify(snapshotAfter, null, 2));
  console.log('STUDIO_LOGS_AFTER');
  console.log(JSON.stringify(consoleLogs.slice(-20), null, 2));

  await page.screenshot({
    path: '/tmp/site-admin-react-studio-check.png',
    fullPage: true,
  });
});
