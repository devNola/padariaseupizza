import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Divider,
  Stack,
  TextField,
  Box,
  Button,
  Modal,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Swal from "sweetalert2";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AdicionarProduto from "./AddProduto";
import EditProduto from "./EditProduto";
import { api, API_URL } from "../../services/api";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ProdutosList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filter, setFilter] = useState("");
  const [rows, setRows] = useState([]);
  const [selectedProduto, setSelectedProduto] = useState(null); // Produto selecionado para edição
  const [editModalOpen, setEditModalOpen] = useState(false); // Controle do modal de edição
  const [addModalOpen, setAddModalOpen] = useState(false); // Controle do modal de adição

  const fetchProdutos = async () => {
    try {
      const response = await api.get("/api/padaria");

      // Corrigir o caminho das imagens
      const produtosComImagens = response.data.map(produto => ({
        ...produto,
        imagem: produto.imagem
          ? produto.imagem.startsWith("http")
            ? produto.imagem
            : `${API_URL}/uploads/${produto.imagem}`
          : null
      }));

      setRows(produtosComImagens);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const handleProductAdded = () => {
    fetchProdutos();
    setAddModalOpen(false);
  };

  const handleProductUpdated = () => {
    fetchProdutos();
    setEditModalOpen(false);
    setSelectedProduto(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const deleteProduto = async (id) => {
    const confirmation = await Swal.fire({
      title: "Excluir Produto",
      text: "Deseja realmente excluir este produto?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, deletar",
      cancelButtonText: "Cancelar",
    });

    if (confirmation.isConfirmed) {
      try {
        await api.delete(`/padaria/destroy/${id}`);
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
        Swal.fire("Deletado!", "O produto foi removido com sucesso.", "success");
      } catch {
        Swal.fire(
          "Erro!",
          "Ocorreu um erro ao tentar excluir o produto. Tente novamente.",
          "error"
        );
      }
    }
  };

  const toggleHighlight = async (id) => {
    try {
      await api.post(`/padariaDestaca/${id}`);
      fetchProdutos();
      Swal.fire("Sucesso!", "Produto destacado com sucesso.", "success");
    } catch {
      Swal.fire("Erro!", "Ocorreu um erro ao tentar destacar o produto. Tente novamente.", "error");
    }
  };

  const filteredRows = rows.filter((row) =>
    row.nome.toLowerCase().includes(filter.toLowerCase())
  );

  const handleEditOpen = (produto) => {
    setSelectedProduto(produto);
    setEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setSelectedProduto(null);
  };

  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{ padding: "20px" }}
        >
          Lista de Produtos
        </Typography>
        <Divider />
        <Box height={10} />
        <Stack
          direction="row"
          spacing={2}
          sx={{ padding: "20px" }}
          justifyContent="space-between"
          alignItems="center"
        >
          <TextField
            label="Pesquisar Produtos"
            variant="outlined"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{ width: "70%" }}
          />
          <Button
            variant="contained"
            endIcon={<AddCircleIcon />}
            onClick={() => setAddModalOpen(true)}
          >
            Adicionar Produto
          </Button>
        </Stack>
        <Box height={10} />
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Imagem</TableCell>
                <TableCell align="left">Nome</TableCell>
                <TableCell align="left">Preço</TableCell>
                <TableCell align="left">Categoria</TableCell>
                <TableCell align="left">Descrição</TableCell>
                <TableCell align="left">Data</TableCell>
                <TableCell align="center">Destaque</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    <TableCell align="left">
                      {row.imagem ? (
                        <img
                          src={row.imagem}
                          alt={row.nome}
                          style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8 }}
                        />
                      ) : (
                        <span style={{ color: "#aaa" }}>Sem imagem</span>
                      )}
                    </TableCell>
                    <TableCell align="left">{row.nome}</TableCell>
                    <TableCell align="left">{row.preco}</TableCell>
                    <TableCell align="left">{row.categoria}</TableCell>
                    <TableCell align="left" style={{ maxWidth: 180, whiteSpace: "pre-line", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {row.descricao}
                    </TableCell>
                    <TableCell align="left">{row.data}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => toggleHighlight(row.id)}
                        color={row.destaque ? "primary" : "default"}
                      >
                        {row.destaque ? <StarIcon /> : <StarBorderIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <EditIcon
                          sx={{
                            fontSize: "20px",
                            color: "blue",
                            cursor: "pointer",
                          }}
                          onClick={() => handleEditOpen(row)}
                        />
                        <DeleteIcon
                          sx={{
                            fontSize: "20px",
                            color: "darkred",
                            cursor: "pointer",
                          }}
                          titleAccess="Excluir"
                          onClick={() => deleteProduto(row.id)}
                        />
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Modal para Adicionar Produto */}
      <Modal open={addModalOpen} onClose={() => setAddModalOpen(false)}>
        <Box sx={modalStyle}>
          <AdicionarProduto
            CloseEvent={() => setAddModalOpen(false)}
            onProductAdded={handleProductAdded}
          />
        </Box>
      </Modal>

      {/* Modal para Editar Produto */}
      {selectedProduto && (
        <Modal open={editModalOpen} onClose={handleEditClose}>
          <Box sx={modalStyle}>
            <EditProduto
              CloseEvent={handleEditClose}
              produto={selectedProduto}
              onProductUpdated={handleProductUpdated}
            />
          </Box>
        </Modal>
      )}
    </>
  );
}
