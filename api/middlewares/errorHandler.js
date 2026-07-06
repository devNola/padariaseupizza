import logger from '../logger.js';

export function errorHandler(err, req, res, next) {
  // Log full error server-side for investigation (don't expose stack to clients in production)
  logger.error({ err, method: req.method, url: req.originalUrl });

  const status = err.status || 500;
  const isProd = process.env.NODE_ENV === 'production';

  const body = {
    error: isProd ? 'Erro interno' : err.message,
  };

  // Include validation / Sequelize errors details in non-production for easier debugging
  if (!isProd && err.errors) {
    body.details = err.errors;
  }

  res.status(status).json(body);
}
