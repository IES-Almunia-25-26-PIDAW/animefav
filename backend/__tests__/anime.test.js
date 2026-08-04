// tests/anime.test.js
const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/database');

describe('GET /api/animes', () => {
  afterAll(async () => {
    await db.end();
  });


  it('devuelve un listado de animes sin error', async () => {
    const res = await request(app).get('/api/animes');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('acepta parámetros de paginación sin romperse', async () => {
    const res = await request(app).get('/api/animes?limit=5&offset=0');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeLessThanOrEqual(5);
  });
});