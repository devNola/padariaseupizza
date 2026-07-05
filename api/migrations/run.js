import { Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Reuse existing DB connection config via environment vars
const sequelize = new Sequelize(process.env.DB_NAME || 'padaria', process.env.DB_USER || 'root', process.env.DB_PASS || '', {
  host: process.env.DB_HOST || 'localhost',
  dialect: process.env.DB_DIALECT || 'mysql',
  logging: false,
});

const umzug = new Umzug({
  migrations: { glob: path.join(__dirname, '/*.js') },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

export async function up() {
  await umzug.up();
  await sequelize.close();
}

if (process.argv[1].endsWith('run.js')) {
  // invoked directly
  up().then(() => console.log('Migrations finished')).catch(err => { console.error(err); process.exit(1); });
}
