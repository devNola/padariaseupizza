import { Cliente } from '../models/Cliente.js';
import { Logs } from '../models/logs.js';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

export const clienteIndex = async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.status(200).json(clientes);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const adminCreate = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    res.status(400).json({ id: 0, msg: "Erro... Informe os dados" });
    return;
  }
  try {
    const existingCliente = await Cliente.findOne({ where: { email: email } });

    if (existingCliente) {
      return res.status(400).json({ id: 0, msg: "Erro... Email já está em uso" });
    }

    const id = uuidv4();
    const token = uuidv4();

    const cliente = await Cliente.create({
      id,
      senha,
      nome,
      token,
      email,
      admin: '0'
    });

    return res.status(201).json({ cliente, token });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const adminLogin = async (req, res) => {
  const { email, senha } = req.body;

  try {
    if (!email || !senha) {
      res.status(400).json({ erro: 'E-mail e senha são obrigatórios' });
      return;
    }

    const cliente = await Cliente.findOne({ where: { email, senha } });

    if (!cliente) {
      console.log("Tentativa de login com e-mail:", email, "e senha:", senha, "falhou.");
      res.status(400).json({ erro: 'E-mail ou senha incorretos' });
      return;
    }

    console.log("Login bem sucedido para o cliente com ID:", cliente.id);

    if (!cliente.token) {
      const segredo = `seu_segredo_${cliente.email}_secreto`;
      const token = jwt.sign({ clienteId: cliente.id, email: cliente.email }, segredo, { expiresIn: '1h' });

      await Cliente.update({ token }, { where: { id: cliente.id } });

      console.log("Tipo de usuário:", cliente.admin ? 'admin' : 'cliente');
      res.status(200).json({ token, userType: cliente.admin ? 'admin' : 'cliente' });
    } else {
      console.log("Tipo de usuário:", cliente.admin ? 'admin' : 'cliente');
      res.status(200).json({ token: cliente.token, userType: cliente.admin ? 'admin' : 'cliente', userName: cliente.nome });
    }

  } catch (error) {
    console.error("Erro durante a tentativa de login:", error);
    res.status(500).send({ erro: 'Ocorreu um erro ao processar a solicitação' });
  }
};

export const administradores = async (req, res) => {
  try {
    const administradores = await Cliente.findAll({
      where: { admin: true },
      attributes: ['token', 'email', 'nome', 'admin']
    });
    res.json(administradores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const logsCreate = async (req, res) => {
  try {
    const { usuario, descricao } = req.body;

    if (!usuario || !descricao) {
      return res.status(400).json({ error: 'Usuário e descrição são obrigatórios' });
    }

    const log = await Logs.create({
      usuario,
      descricao,
      data: new Date(),
    });

    res.status(201).json(log);
  } catch (error) {
    console.error('Erro ao criar log:', error);
    res.status(500).json({ error: 'Erro ao criar log' });
  }
};

export const obterTodosOsLogs = async (req, res) => {
  try {
    const logs = await Logs.findAll({
      order: [['data', 'DESC']],
    });

    if (logs.length > 0) {
      res.status(200).json({ logs });
    } else {
      res.status(404).json({ message: 'Nenhum log encontrado' });
    }
  } catch (error) {
    console.error('Erro ao obter os logs:', error);
    res.status(500).json({ error: 'Erro ao obter os logs' });
  }
};
