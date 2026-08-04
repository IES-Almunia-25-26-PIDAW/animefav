module.exports = {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/__tests__/env.setup.js'],

  testPathIgnorePatterns: ['/node_modules/', '__tests__/env.setup.js'],
  testTimeout: 15000,
  maxWorkers: 1,
  // Cierra el proceso al terminar aunque queden conexiones abiertas

  forceExit: true,
};