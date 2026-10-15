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

test('GET /api/locations/:id returns a matching JSON location without a Metro asset', async () => {
  const response = await fetch(`${baseUrl}/api/locations/north-hall`);
  const location = await response.json() as { id: string; name: string; rating: number; image?: unknown };

  assert.equal(response.status, 200);
  assert.equal(location.id, 'north-hall');
  assert.equal(location.name, 'North Hall');
  assert.equal(location.rating, 4.9);
  assert.equal('image' in location, false);
});

test('GET /api/locations/:id returns JSON 404 for an unknown location', async () => {
  const response = await fetch(`${baseUrl}/api/locations/missing-location`);
  const body = await response.json() as { error: string };

  assert.equal(response.status, 404);
  assert.equal(body.error, 'Location not found');
});

test('GET /api/locations/:id/ratings returns matching ratings', async () => {
  const response = await fetch(`${baseUrl}/api/locations/hekman-library/ratings`);
  const ratings = await response.json() as Array<{ id: string; locationId: string; stars: number }>;

  assert.equal(response.status, 200);
  assert.equal(ratings.length, 1);
  assert.equal(ratings[0].id, 'rating-1');
  assert.equal(ratings[0].locationId, 'hekman-library');
  assert.equal(ratings[0].stars, 5);
});

test('GET ratings for a known location without ratings returns an empty array', async () => {
  const response = await fetch(`${baseUrl}/api/locations/business-building/ratings`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), []);
});

test('GET ratings for an unknown location returns 404', async () => {
  const response = await fetch(`${baseUrl}/api/locations/missing-location/ratings`);
  const body = await response.json() as { error: string };

  assert.equal(response.status, 404);
  assert.equal(body.error, 'Location not found');
});

test('malformed encoded location IDs return 400', async () => {
  const response = await fetch(`${baseUrl}/api/locations/%E0%A4%A`);
  const body = await response.json() as { error: string };

  assert.equal(response.status, 400);
  assert.equal(body.error, 'Malformed location ID');
});

test('unsupported methods return 405 and advertise GET', async () => {
  const response = await fetch(`${baseUrl}/api/locations`, { method: 'POST' });
  const body = await response.json() as { error: string };

  assert.equal(response.status, 405);
  assert.equal(response.headers.get('allow'), 'GET');
  assert.equal(body.error, 'Method not allowed');
});

test('unknown API routes return 404', async () => {
  const response = await fetch(`${baseUrl}/api/unknown`);

  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { error: 'Not found' });
});