import { Router } from "express";
import { adicionarAoCarrinho, finalizarCompra } from './controllers/carrinhoController.js';
import {
  clienteCreate,
  clienteIndex,
  clienteLogin,
  clienteShow,
} from "./controllers/clienteController.js";
import {
  padariaCreate,
  padariaDestaca,
  padariaDestaques,
  padariaIndex,
  padariaDestroy,
  PadariaUpdate,
  upload,
} from "./controllers/PadariaController.js";
import {
  avaliacaoCreate,
  avaliacaoDestroy,
  avaliacaopadaria,
  avaliacaoGraphDias,
  avaliacaoGraphEstrelas,
  avaliacaoIndex,
  dadosGerais,
} from "./controllers/avaliacaoController.js";
import {
  adminCreate,
  adminLogin,
  logsCreate,
  obterTodosOsLogs,
} from "./controllers/admincontroller.js";
import { verificaLogin } from "./middlewares/verificaLogin.js";
import { createPreference, webhook } from "./controllers/paymentController.js";

const router = Router();

// Clientes/Admins
router
  .get("/clienteslistar", clienteIndex)
  .post("/clientes", clienteCreate)
  .post("/login", clienteLogin)
  .get("/loginadmin", adminLogin)
  .post("/criarloginadmin", adminCreate)
  .get('/clientes/:token', clienteShow)
  // Logs admins
  .post("/setlogs", logsCreate)
  .get("/logs", obterTodosOsLogs);

// Logs de Carrinho/Finalizar Compra
router.post('/carrinho/adicionar', adicionarAoCarrinho);
router.post('/carrinho/finalizar', finalizarCompra);

// Payments (Mercado Pago)
router.post('/payments/create_preference', verificaLogin, createPreference);
router.post('/payments/webhook', webhook);

// Produtos
router
  .get("/api/padaria", padariaIndex)
  .get("/padaria/destaques", padariaDestaques)
  .post("/padariacreat", upload.single("imagem"), padariaCreate)
  .post("/padariaDestaca/:id", padariaDestaca)
  .delete("/padaria/destroy/:id", padariaDestroy)
  .put("/alterar/:id", upload.single("imagem"), PadariaUpdate);

// Avaliações
router
  .get("/avaliacoes", avaliacaoIndex)
  .post("/avaliacoescreat", verificaLogin, avaliacaoCreate)
  .delete("/avaliacoes/:id", avaliacaoDestroy)
  .get("/avaliacoes/graph", avaliacaoGraphEstrelas)
  .get("/avaliacoes/graph_dias", avaliacaoGraphDias)
  .get("/avaliacoes/padaria/:padariaId", avaliacaopadaria);

router.get("/dados_gerais", dadosGerais);

export default router;
