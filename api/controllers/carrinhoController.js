import { Logs } from '../models/logs.js';
import { Order } from '../models/Order.js';
import { Padaria } from '../models/padaria.js';

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
  try {
    const { produtos, endereco, nomeCliente } = req.body;

    if (!produtos || !Array.isArray(produtos) || produtos.length === 0) {
      return res.status(400).json({ error: 'Produtos inválidos' });
    }

    // Determine user id from authenticated middleware if available
    const userId = req.user_logado_id || req.body.usuario || nomeCliente || 'guest';

    // Recalculate total server-side using product prices from DB
    let items = [];
    let total = 0;

    for (const p of produtos) {
      let product;
      const qty = parseInt(p.qtd || p.quantity || 1, 10);

      if (p.padariaId || p.id) {
        const id = p.padariaId || p.id;
        product = await Padaria.findByPk(id);
      } else if (p.nome) {
        product = await Padaria.findOne({ where: { nome: p.nome } });
      }

      if (!product) {
        return res.status(400).json({ error: `Produto não encontrado: ${p.padariaId || p.id || p.nome}` });
      }

      const unit = parseFloat(product.preco);
      const itemTotal = unit * qty;
      total += itemTotal;

      items.push({ padariaId: product.id, nome: product.nome, quantity: qty, unit_price: unit });
    }

    // Create Order in DB
    const order = await Order.create({
      userId,
      items,
      total: total.toFixed(2),
      status: 'pending',
      external_reference: null,
    });

    // Create log
    const listaProdutos = items.map(i => `${i.nome} (x${i.quantity})`).join(', ');
    const descricao = `Finalizou uma compra: Produtos: ${listaProdutos} | Total: R$ ${parseFloat(total).toFixed(2)} | Endereço: ${endereco} | Cliente: ${nomeCliente || userId}`;

    await Logs.create({
      usuario: nomeCliente || userId,
      descricao,
      data: new Date(),
    });

    return res.status(201).json({ msg: 'Pedido criado', orderId: order.id, total: parseFloat(total).toFixed(2) });
  } catch (error) {
    console.error('Erro em finalizarCompra:', error);
    return res.status(500).json({ error: 'Erro ao finalizar compra' });
  }
};
