import express from "express";
import cors from "cors";
import routes from "./routes.js";
import { sequelize } from "./databases/conecta.js";
import { Cliente } from "./models/Cliente.js";
import { Padaria } from "./models/padaria.js";
import { Avaliacao } from "./models/Avaliacao.js";
import { Logs } from "./models/logs.js";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const port = 55000;

// Obter caminho absoluto para a pasta uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadsPath = path.join(__dirname, 'uploads');

app.use(express.json());
app.use(cors());
app.use(routes);
app.use("/uploads", express.static(uploadsPath));

async function conecta_db() {
  try {
    await sequelize.authenticate();
    console.log("Conexão com banco de dados realizada com sucesso");
    await Cliente.sync();
    console.log("Tabela Cliente criada com sucesso");
    await Padaria.sync();
    console.log("Tabela de Produtos criada com sucesso");
    await Avaliacao.sync();
    console.log("Tabela de Avaliação criada com sucesso");
    await Logs.sync();
    console.log("Tabela de Logs criada com sucesso");
  } catch (error) {
    console.error("Erro na conexão com o banco: ", error);
  }
}
conecta_db();

app.get("/", (req, res) => {
  res.send("API Projeto TCC - Padaria");
});

app.listen(port, () => {
  console.log(`Servidor Rodando na Porta: ${port}`);
});
