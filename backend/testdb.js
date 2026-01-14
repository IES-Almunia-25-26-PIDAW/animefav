const db = require('./src/config/database');

async function testConnection() {
  try {
    const [rows] = await db.execute('SELECT 1 + 1 AS result');
    console.log('✅ Conexión exitosa a la base de datos');
    console.log('Resultado de prueba:', rows);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    process.exit(1);
  }
}

testConnection();