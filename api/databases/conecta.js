import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
import logger from '../logger.js';

dotenv.config();

// Conexão com o banco de dados usando variáveis de ambiente
export const sequelize = new Sequelize(
  process.env.DB_NAME || 'padaria',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '',
  {
    dialect: process.env.DB_DIALECT || 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    logging: false,
  }
);

// Testando a conexão com o banco de dados
(async function testConnection() {
  try {
    await sequelize.authenticate();
    logger.info('Conexão com o banco de dados realizada com sucesso');
  } catch (error) {
    logger.error({ err: error, msg: 'Erro: Falha ao se conectar ao banco de dados' });
    // Em ambientes de produção, preferimos falhar rápido
    if (process.env.NODE_ENV === 'production') process.exit(1);
  }
})();
