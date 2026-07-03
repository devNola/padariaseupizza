import { Cliente } from "../models/Cliente.js";
import { Logs } from "../models/logs.js";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_KEY || "defaultsecret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const SALT_ROUNDS = 10;

export const clienteIndex = async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.status(200).json(clientes);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const clienteCreate = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    res.status(400).json({ id: 0, msg: "Erro... Informe os dados" });
    return;
  }

  try {
    const existingCliente = await Cliente.findOne({ where: { email } });

    if (existingCliente) {
      return res
        .status(400)
        .json({ id: 0, msg: "Erro... Email já está em uso" });
    }

    const id = uuidv4();
    const token = uuidv4();

    const hashedSenha = await bcrypt.hash(senha, SALT_ROUNDS);

    const cliente = await Cliente.create({
      id,
      senha: hashedSenha,
      nome,
      token,
      email,
      admin: false,
    });

    // Criar log para o cliente cadastrado
    await Logs.create({
      usuario: nome,
      descricao: `Cliente ${nome} foi cadastrado com sucesso.`,
      data: new Date(),
    });

    return res.status(201).json({ cliente: { id: cliente.id, nome: cliente.nome, email: cliente.email }, token });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const clienteLogin = async (req, res) => {
  const { email, senha } = req.body;

  try {
    if (!email || !senha) {
      res.status(400).json({ erro: "E-mail e senha são obrigatórios" });
      return;
    }

    const cliente = await Cliente.findOne({ where: { email } });

    if (!cliente) {
      res.status(400).json({ erro: "E-mail ou senha incorretos" });
      return;
    }

    const match = await bcrypt.compare(senha, cliente.senha);
    if (!match) {
      res.status(400).json({ erro: "E-mail ou senha incorretos" });
      return;
    }

    // Adiciona o log de login do cliente
    await Logs.create({
      usuario: cliente.nome,
      descricao: `Cliente ${cliente.nome} fez login.`,
      data: new Date(),
    });

    // Gerar JWT
    const tokenJwt = jwt.sign({ userId: cliente.id, userName: cliente.nome }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(200).json({ token: tokenJwt, legacyToken: cliente.token, userType: cliente.admin ? "admin" : "cliente", userName: cliente.nome });
  } catch (error) {
    console.error("Erro durante a tentativa de login:", error);
    res.status(500).send({ erro: "Ocorreu um erro ao processar a solicitação" });
  }
};

export const clienteShow = async (req, res) => {
  const token = req.params.token;

  try {
    const cliente = await Cliente.findOne({ where: { token } });

    if (!cliente) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    res.status(200).json({
      id: cliente.id,
      nome: cliente.nome,
    });
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    res.status(500).json({ error: "Erro ao buscar cliente" });
  }
};
