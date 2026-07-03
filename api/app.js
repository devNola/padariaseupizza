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

// Security & config
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const port = process.env.PORT || 55000;

// Obter caminho absoluto para a pasta uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadsPath = path.join(__dirname, 'uploads');

// Basic middleware
app.use(helmet());
app.use(compression());

// Rate limiter (basic)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite por IP
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(express.json());

// CORS: restringir em produção via FRONTEND_URL
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
};
app.use(cors(corsOptions));

app.use(routes);

// Servir uploads com cache-control (7 dias)
app.use("/uploads", express.static(uploadsPath, { maxAge: '7d' }));

// Conectar ao DB e sincronizar (somente sync minimal — em produção use migrations)
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

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get("/", (req, res) => {
  res.send("API Projeto TCC - Padaria");
});

// Error handler (não retornar stack em produção)
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production' ? 'Erro interno' : err.message;
  res.status(status).json({ error: message });
});

app.listen(port, () => {
  console.log(`Servidor Rodando na Porta: ${port}`);
});
