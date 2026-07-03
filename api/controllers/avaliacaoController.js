import { Op } from "sequelize"
import { sequelize } from '../databases/conecta.js'
import { Avaliacao } from '../models/Avaliacao.js';
import { Cliente } from '../models/Cliente.js';
import { Padaria } from '../models/padaria.js';
import { Logs } from '../models/logs.js';

export const avaliacaoIndex = async (req, res) => {

  try {
    const avaliacoes = await Avaliacao.findAll({
      include: [Cliente, Padaria],
      order: [['id', 'desc']]
    });
    res.status(200).json(avaliacoes)
  } catch (error) {
    res.status(400).send(error)
  }
}

export const avaliacaopadaria = async (req, res) => {
  const { padariaId } = req.params; // Obter o ID da padaria dos parâmetros da rota
  console.log(padariaId); // Certifique-se de que isso está imprimindo o ID da padaria


  try {
    const avaliacoes = await Avaliacao.findAll({
      where: { padaria_id: padariaId }, // Use o ID da padaria para filtrar as avaliações
      include: Cliente,
      order: [['id', 'desc']]
    });
    res.status(200).json(avaliacoes);
  } catch (error) {
    res.status(400).send(error);
  }
}



export const avaliacaoGraphEstrelas = async (req, res) => {

  try {
    const avaliacoes = await Avaliacao.findAll({
      attributes: ['estrelas',
        [sequelize.fn('count', sequelize.col('id')), 'num']],
      group: 'estrelas'
    });
    res.status(200).json(avaliacoes)
  } catch (error) {
    res.status(400).send(error)
  }
}

export const avaliacaoGraphDias = async (req, res) => {

  const data = new Date()           // obtém a data atual
  data.setDate(data.getDate() - 7)  // subtrai 7 dias 

  const dia = data.getDate().toString().padStart(2, "0")
  const mes = (data.getMonth() + 1).toString().padStart(2, "0")
  const ano = data.getFullYear()

  const atras_7 = ano + "-" + mes + "-" + dia

  try {
    const avaliacoes = await Avaliacao.findAll({
      attributes: [
        [sequelize.fn('DAY', sequelize.col('data')), "dia"],
        [sequelize.fn('MONTH', sequelize.col('data')), "mes"],
        'estrelas',
        [sequelize.fn('count', sequelize.col('id')), 'num']],
      group: [
        sequelize.fn('DAY', sequelize.col('data')),
        sequelize.fn('MONTH', sequelize.col('data')),
        'estrelas'],
      where: { data: { [Op.gte]: atras_7 } }
    });
    res.status(200).json(avaliacoes)
  } catch (error) {
    res.status(400).send(error)
  }
}

export const avaliacaoCreate = async (req, res) => {
  const { padaria_id, cliente_id, estrelas, comentario } = req.body;

  // Verifica se todos os dados necessários foram fornecidos
  if (!padaria_id || !cliente_id || !estrelas) {
    return res.status(400).json({ id: 0, msg: "Erro... Informe os dados necessários" });
  }

  const t = await sequelize.transaction();

  try {
    // Cria a avaliação
    const avaliacao = await Avaliacao.create(
      {
        padaria_id,
        cliente_id,
        estrelas,
        comentario: comentario || "", // Comentário é opcional
        data: new Date(),
      },
      { transaction: t }
    );

    // Atualiza os dados da padaria (soma de estrelas e número de avaliações)
    await Padaria.increment(
      { soma: estrelas, num: 1 },
      { where: { id: padaria_id }, transaction: t }
    );

    // Busca nome do cliente e produto para log
    const cliente = await Cliente.findByPk(cliente_id);
    const padaria = await Padaria.findByPk(padaria_id);

    await Logs.create({
      usuario: cliente ? cliente.nome : "Desconhecido",
      descricao: `Avaliou o produto "${padaria ? padaria.nome : padaria_id}" com ${estrelas} estrela(s).`,
      data: new Date(),
    });

    await t.commit();
    return res.status(201).json(avaliacao);
  } catch (error) {
    await t.rollback();
    return res.status(400).json({ id: 0, msg: "Erro ao criar avaliação", error: error.message });
  }
};

export const avaliacaoDestroy = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ "erro": "id nao fornecido" });
    return;
  }

  const t = await sequelize.transaction();

  try {
    const avaliacao = await Avaliacao.findByPk(id);

    if (!avaliacao) {
      res.status(404).json({ "wrro": "avaliaçao nao encontrada" });
      return;
    }

    await Padaria.decrement('soma', {
      by: avaliacao.estrelas,
      where: { id: avaliacao.padaria_id },
      transaction: t
    });

    await Padaria.decrement('num', {
      by: 1,
      where: { id: avaliacao.padaria_id },
      transaction: t
    });

    await Avaliacao.destroy({
      where: { id },
      transaction: t
    });

    await t.commit();

    res.status(200).json({ msg: "Avaliação excluída com sucesso" });
  } catch (error) {

    await t.rollback();
    res.status(500).json({ "erro": "erro ao deletar a avaliaçao", "detalhes": error.message });
  }
};


export const dadosGerais = async (req, res) => {

  const dataAtual = new Date().toISOString().split("T")[0]

  try {
    const clientes = await Cliente.count()
    const padariaCount = await Padaria.count()
    const media = await Padaria.findOne({
      attributes: [[sequelize.fn('avg', sequelize.col('preco')), 'avgPreco']]
    })
    const mediaPreco = media.dataValues.avgPreco !== null ? parseFloat(media.dataValues.avgPreco).toFixed(2) : 0;

    const avaliacoes = await Avaliacao.count()
    const avaliacoesDia = await Avaliacao.count({
      where: { data: { [Op.gte]: dataAtual } }
    })

    res.status(200).json({ clientes, padaria: padariaCount, media: mediaPreco, avaliacoes, avaliacoesDia })
  } catch (error) {
    res.status(400).send(error)
  }
}

