import { Padaria } from "../models/padaria.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from "fs";
import { v4 as uuidv4 } from 'uuid';

// Obter caminho absoluto para a pasta uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadsPath = path.join(__dirname, '..', 'uploads');

// Garantir que a pasta uploads exista
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

// Configuração do multer para salvar em disco com validação e nomes únicos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsPath); // Usar caminho absoluto
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Tipo de arquivo não permitido"), false);
};

export const upload = multer({
  storage: storage,
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
});

export const padariaIndex = async (req, res) => {
  try {
    const padarias = await Padaria.findAll();

    const padariasComMedia = padarias.map((padaria) => {
      const obj = padaria.toJSON();
      const mediaEstrelas = obj.num > 0 ? obj.soma / obj.num : 0;
      return {
        ...obj,
        mediaEstrelas: parseFloat(mediaEstrelas.toFixed(1)), // Média com 1 casa decimal
        imagem: obj.imagem
          ? `${req.protocol}://${req.get("host")}/uploads/${obj.imagem}`
          : null,
      };
    });

    res.status(200).json(padariasComMedia);
  } catch (error) {
    console.error("Erro ao buscar padarias:", error);
    res.status(400).send(error);
  }
};

export const padariaDestaques = async (req, res) => {
  try {
    const padarias = await Padaria.findAll({ where: { destaque: true } });
    res.status(200).json(padarias);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const padariaDestaca = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "ID não fornecido" });
  }

  try {
    // posiciona no registro para obter o status atual do campo destaque
    const padaria = await Padaria.findByPk(id);

    if (!padaria) {
      return res.status(404).json({ error: "Padaria não encontrada" });
    }

    // altera com o contrário do atual
    padaria.destaque = !padaria.destaque;
    await padaria.save();

    res.status(200).json(padaria);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const padariaCreate = async (req, res) => {
  const { nome, preco, categoria, data, destaque, descricao } = req.body;
  const imagem = req.file ? req.file.filename : null;

  if (!nome || !preco || !categoria || !data) {
    return res
      .status(400)
      .json({ id: 0, msg: "Erro... Informe todos os dados necessários" });
  }

  try {
    const existingProduct = await Padaria.findOne({ where: { nome } });
    if (existingProduct) {
      return res
        .status(400)
        .json({ id: 0, msg: "Já existe um nome com esse nome" });
    }

    const padaria = await Padaria.create({
      nome,
      preco,
      categoria,
      data,
      destaque,
      descricao,
      imagem,
    });

    return res.status(201).json(padaria);
  } catch (error) {
    return res.status(400).send(error);
  }
};

export async function PadariaUpdate(req, res) {
  const { id } = req.params;
  // Se vier via multipart, os campos podem estar em req.body (como string) e a imagem em req.file
  let { nome, categoria, preco, data, descricao } = req.body;
  // Converter preco para número se vier como string
  if (typeof preco === "string") preco = parseFloat(preco);

  if (!nome || !categoria || !preco || !data) {
    res.status(400).json({
      error: "Erro... Informe nome, categoria, preço, data e descrição.",
    });
    return;
  }

  try {
    // Busca o produto atual
    const produto = await Padaria.findByPk(id);
    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    // Se veio uma nova imagem, remove a antiga (se existir)
    let imagem = produto.imagem;
    if (req.file) {
      // Remove imagem antiga do disco, se existir
      if (imagem) {
        const oldPath = path.join(uploadsPath, imagem);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      imagem = req.file.filename;
    }

    await Padaria.update(
      {
        nome,
        categoria,
        preco,
        data,
        descricao,
        imagem, // Atualiza imagem se veio nova
      },
      {
        where: { id },
      }
    );

    res.status(200).json({ message: "Produto atualizado com sucesso." });
  } catch (error) {
    console.error("Erro ao atualizar o produto:", error);
    res.status(500).json({ error: "Erro ao atualizar o produto." });
  }
}

export const padariaDestroy = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ error: "ID da padaria não fornecido" });
    }

    const padaria = await Padaria.findByPk(id);

    if (!padaria) {
      return res.status(404).json({ error: "Padaria não encontrada" });
    }

    await Padaria.destroy({ where: { id } });
    res.status(200).json({ msg: "Ok! Removido com Sucesso" });
  } catch (error) {
    console.error("Erro ao excluir a padaria:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
