import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import type { AddressInfo } from 'node:net';
import { createApiServer } from '../src/server.js';

const server = createApiServer();
let baseUrl = '';

before(async () => {
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test('GET /api/locations returns the mock location list as JSON', async () => {
  const response = await fetch(`${baseUrl}/api/locations`);
  const locations = await response.json() as Array<{ id: string; name: string }>;

  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type') ?? '', /application\/json/);
  assert.equal(locations.length, 9);
  assert.equal(locations[0].id, 'hekman-library');
});