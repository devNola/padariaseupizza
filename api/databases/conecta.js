import { Sequelize } from "sequelize";

// Conexão com o banco de dados
export const sequelize = new Sequelize(
  process.env.DB_NAME || 'padaria',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    dialect: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    logging: false,
  },
);

// Testando a conexão com o banco de dados
sequelize
  .authenticate()
  .then(function () {
    console.log("Conexão com o banco de dados realizada com sucesso!");
  })
  .catch(function (error) {
    console.error('Erro: falha ao se conectar ao banco de dados.');
  });
