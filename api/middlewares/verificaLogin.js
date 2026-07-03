import jwt from 'jsonwebtoken'

import * as dotenv from 'dotenv'
dotenv.config()

export const verificaLogin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({ error: "Token não fornecido" });
    }
    const parts = authHeader.split(" ");
    if (parts.length !== 2) return res.status(401).send({ error: "Token inválido" });
    const token = parts[1];
    const secret = process.env.JWT_SECRET || process.env.JWT_KEY;
    if (!secret) return res.status(500).send({ error: "Chave JWT não configurada no servidor" });

    const decode = jwt.verify(token, secret);
    // payload will include userId and userName
    req.user_logado_id = decode.userId;
    req.user_logado_nome = decode.userName;
    next();
  } catch (error) {
    return res.status(401).send({ error: "Falha na Autenticação" });
  }
}
