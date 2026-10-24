const { test } = require('node:test');
const assert = require('node:assert');
const http = require('http');
const { server } = require('./server');

function get(path, port) {
  return new Promise((resolve, reject) => {
    http
      .get({ port, path }, (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
      })
      .on('error', reject);
  });
}

test('server endpoints', async (t) => {
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();

  await t.test('GET /health returns ok', async () => {
    const res = await get('/health', port);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'ok');
  });

  await t.test('GET / returns greeting', async () => {
    const res = await get('/', port);
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.message.includes('CI/CD'));
  });

  await new Promise((resolve) => server.close(resolve));
});
