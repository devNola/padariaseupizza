import { Cliente } from '../models/Cliente.js';

const getTokenFromRequest = (req) => {
  const authorization = req.headers.authorization || '';
  if (authorization.startsWith('Bearer ')) return authorization.slice(7).trim();
  return req.headers['x-auth-token'] || null;
};

export const verificaAdmin = async (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    return res.status(401).json({ erro: 'Autenticação necessária.' });
  }

  try {
    const cliente = await Cliente.findOne({ where: { token } });
    const isAdmin = cliente && (cliente.admin === true || cliente.admin === 1 || cliente.admin === '1' || cliente.admin === 'true');

    if (!isAdmin) {
      return res.status(403).json({ erro: 'Acesso restrito ao administrador.' });
    }

    req.admin = {
      id: cliente.id,
      nome: cliente.nome,
      email: cliente.email,
    };
    return next();
  } catch (error) {
    return res.status(500).json({ erro: 'Não foi possível validar a sessão.' });
  }
};
