import express from "express";
import cors from "cors";
import routes from "./routes.js";
import { sequelize } from "./databases/conecta.js";
import { Cliente } from "./models/Cliente.js";
import { Padaria } from "./models/padaria.js";
import { Avaliacao } from "./models/Avaliacao.js";
import { Logs } from "./models/logs.js";
import { Order } from "./models/Order.js";
import { Notification } from "./models/Notification.js";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Security & config
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import logger from './logger.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 55000;

// Obter caminho absoluto para a pasta uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadsPath = path.join(__dirname, 'uploads');

// Basic middleware
app.disable('x-powered-by');
app.use(helmet());
app.use(compression());

// Logger in non-production
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Rate limiter (basic)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite por IP
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parser with size limit
app.use(express.json({ limit: '100kb' }));

// CORS: restringir em produção via FRONTEND_URL
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : '*',
};
app.use(cors(corsOptions));

app.use(routes);

// Servir uploads com cache-control (7 dias)
app.use("/uploads", express.static(uploadsPath, { maxAge: '7d' }));

// Conectar ao DB e sincronizar (somente sync minimal — em produção use migrations)
async function conecta_db() {
  try {
    await sequelize.authenticate();
    logger.info({ msg: 'Conexão com banco de dados realizada com sucesso' });
    await Cliente.sync();
    logger.info({ msg: 'Tabela Cliente criada com sucesso' });
    await Padaria.sync();
    logger.info({ msg: 'Tabela de Produtos criada com sucesso' });
    await Avaliacao.sync();
    logger.info({ msg: 'Tabela de Avaliação criada com sucesso' });
    await Logs.sync();
    logger.info({ msg: 'Tabela de Logs criada com sucesso' });
    await Order.sync();
    logger.info({ msg: 'Tabela de Orders criada com sucesso' });
    await Notification.sync();
    logger.info({ msg: 'Tabela de Notifications criada com sucesso' });
  } catch (error) {
    logger.error({ msg: 'Erro na conexão com o banco', err: error });
    process.exit(1);
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
  logger.error({ err });
  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production' ? 'Erro interno' : err.message;
  res.status(status).json({ error: message });
});

// Start server with graceful shutdown
const server = app.listen(port, () => {
  logger.info(`Servidor Rodando na Porta: ${port}`);
});

const shutdown = async () => {
  logger.info('Iniciando graceful shutdown');
  try {
    await sequelize.close();
    logger.info('Conexão com DB encerrada');
    server.close(() => {
      logger.info('Servidor encerrado');
      process.exit(0);
    });
  } catch (err) {
    logger.error({ err, msg: 'Erro durante shutdown' });
    process.exit(1);
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
