const REQUIRED_VARS_COMUNES = [
  'NODE_ENV',
  'PORT',
  'DATABASE_URL',
  'DB_HOST',
  'DB_USER',
  'DB_PASS',
  'DB_NAME',
  'JWT_SECRET',
  'REDIS_HOST',
  'REDIS_PORT',
  'FRONTEND_URL',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];
 
// En producción, el correo se envía con Resend (emails reales).
const REQUIRED_VARS_PRODUCTION = ['RESEND_API_KEY'];
 
// En desarrollo, el correo se envía a Mailtrap (sandbox, no sale de ahí).
const REQUIRED_VARS_DEVELOPMENT = ['MAIL_HOST', 'MAIL_PORT', 'MAIL_USER', 'MAIL_PASS'];
 
function validateEnv() {
  const faltantes = REQUIRED_VARS_COMUNES.filter((key) => !process.env[key]);
 
  const especificasDelEntorno =
    process.env.NODE_ENV === 'production'
      ? REQUIRED_VARS_PRODUCTION
      : REQUIRED_VARS_DEVELOPMENT;
 
  faltantes.push(...especificasDelEntorno.filter((key) => !process.env[key]));
 
  if (faltantes.length > 0) {
    console.error('❌ Faltan variables de entorno obligatorias:');
    faltantes.forEach((key) => console.error(`   - ${key}`));
    console.error(
      `   Revisa tu archivo .env.${process.env.NODE_ENV || 'development'} contra .env.example`
    );
    process.exit(1);
  }
 
  console.log(`✅ Variables de entorno validadas (entorno: ${process.env.NODE_ENV})`);
}
 
module.exports = { validateEnv };
 