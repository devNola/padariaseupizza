import { body, validationResult } from 'express-validator';

export const validateFinalizarCompra = [
  body('produtos')
    .isArray({ min: 1 })
    .withMessage('Produtos deve ser um array não vazio'),
  body('produtos.*.padariaId')
    .optional()
    .isInt()
    .withMessage('padariaId deve ser inteiro'),
  body('produtos.*.qtd')
    .optional()
    .isInt({ min: 1 })
    .withMessage('qtd deve ser inteiro maior que zero'),
  body('endereco').notEmpty().withMessage('endereco é obrigatório'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    next();
  },
];

export const validateCreatePreference = [
  body('orderId').notEmpty().withMessage('orderId é obrigatório').isUUID().withMessage('orderId deve ser um UUID'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    next();
  },
];
