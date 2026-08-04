// __tests__/auth.test.js
const request = require('supertest');
// Mockeamos el envio de emails: en los tests no queremos que salga ningun
// correo real

jest.mock('../src/services/emailService', () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue(true),
}));

const app = require('../src/app');
const db = require('../src/config/database');

const testEmail = `test_${Date.now()}@animefav.test`;
const testPassword = 'PasswordSeguro123';

describe('Auth endpoints', () => {
  afterAll(async () => {
    await db.execute('DELETE FROM Usuario WHERE email = ?', [testEmail]);
    await db.end();
  });

  test('POST /register debe fallar si faltan datos', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({ email: 'test@test.com' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test('POST /register registra un usuario nuevo correctamente', async () => {
    const res = await request(app).post('/api/users/register').send({
      nombre: 'Usuario Test',
      email: testEmail,
      password: testPassword,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/cuenta creada/i);
  });

  test('POST /register debe fallar si el email ya esta en uso', async () => {
    const res = await request(app).post('/api/users/register').send({
      nombre: 'Otro Usuario',
      email: testEmail,
      password: testPassword,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test('POST /login debe fallar si faltan datos', async () => {
    const res = await request(app).post('/api/users/login').send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test('POST /login debe fallar con email invalido', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'emailinvalido', password: 'wrongpassword' });

    expect([400, 401, 500]).toContain(res.statusCode);
    expect(res.body.error).toBeDefined();
  });

  test('POST /login debe fallar con credenciales invalidas', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'noexiste@test.com', password: 'wrongpassword' });

    expect([401, 500]).toContain(res.statusCode);
    expect(res.body.error).toBeDefined();
  });

  test('POST /login debe fallar si el email no esta verificado', async () => {
    // El usuario registrado arriba nunca llamo a verifyEmail.
    const res = await request(app).post('/api/users/login').send({
      email: testEmail,
      password: testPassword,
    });

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toMatch(/verificar/i);
  });

  test('GET /profile debe fallar sin token', async () => {
    const res = await request(app).get('/api/users/profile');

    expect(res.statusCode).toBe(401);
  });
});