import { Logs } from '../models/logs.js';

export const adicionarAoCarrinho = async (req, res) => {
  const { usuario, nomeProduto } = req.body;

  await Logs.create({
    usuario,
    descricao: `Adicionou o produto ${nomeProduto} ao carrinho.`,
    data: new Date(),
  });

  res.status(200).json({ msg: 'Produto adicionado ao carrinho!' });
};

export const finalizarCompra = async (req, res) => {
  const { usuario, produtos, precoFinal, endereco, nomeCliente } = req.body;

  const listaProdutos = produtos.map(p => `${p.nome} (x${p.qtd})`).join(', ');
  const descricao = `Finalizou uma compra: Produtos: ${listaProdutos} | Total: R$ ${precoFinal.toFixed(2)} | Endereço: ${endereco} | Cliente: ${nomeCliente}`;

  await Logs.create({
    usuario: nomeCliente,
    descricao,
    data: new Date(),
  });

  res.status(201).json({ msg: 'Compra finalizada!' });
};