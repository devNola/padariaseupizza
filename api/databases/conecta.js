import { Sequelize } from "sequelize";

// Conexão com o banco de dados
export const sequelize = new Sequelize("padaria", "root", "1234", {
  dialect: "mysql",
  host: "localhost",
  port: 3306,
});

// Testando a conexão com o banco de dados
sequelize
  .authenticate()
  .then(function () {
    console.log("Conexão com o banco de dados realizada com sucesso!");
  })
  .catch(function (error) {
    console.log("Erro: Falha ao se conectar:");
  });
