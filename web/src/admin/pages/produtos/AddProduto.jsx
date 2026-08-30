import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Divider,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  Paper,
  styled,
  Tooltip,
} from "@mui/material";
import {
  Close as CloseIcon,
  Star as StarIcon,
  PhotoCamera,
  BakeryDining,
  AttachMoney,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { api } from "../../services/api";

const StyledPaper = styled(Paper)(({ theme }) => ({
  position: "relative",
  maxWidth: 520,
  maxHeight: "90vh", // Limita a altura máxima
  margin: "auto",
  padding: theme.spacing(3, 4, 4, 4),
  borderRadius: 18,
  boxShadow: "0 8px 32px 0 rgba(255,167,38,0.15)",
  background: "rgba(255,248,225,0.98)",
  border: `1px solid #ffe0b2`,
  overflow: "auto", // Adiciona scroll quando necessário
  // Estilização da barra de rolagem
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "rgba(255,248,225,0.3)",
    borderRadius: "10px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "rgba(255,167,38,0.6)",
    borderRadius: "10px",
    "&:hover": {
      background: "rgba(255,167,38,0.8)",
    },
  },
}));

export default function AdicionarProduto({ CloseEvent, onProductAdded }) {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [destaque, setDestaque] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagem, setImagem] = useState(null);
  const [preview, setPreview] = useState(null);

  const categorias = [
    { value: "Pães", label: "Pães" },
    { value: "Doces", label: "Doces" },
    { value: "Bebidas", label: "Bebidas" },
    { value: "Salgados", label: "Salgados" },
  ];

  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    setImagem(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("nome", nome);
      formData.append("preco", preco);
      formData.append("categoria", categoria);
      formData.append("data", new Date().toISOString());
      formData.append("destaque", destaque);
      formData.append("descricao", descricao);
      if (imagem) {
        formData.append("imagem", imagem);
      }

      const response = await api.post('/padariacreat', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 201) {
        Swal.fire({
          title: "Sucesso!",
          text: "Produto adicionado com sucesso!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        onProductAdded();
        CloseEvent();
      }
    } catch {
      Swal.fire({
        title: "Erro!",
        text: "Falha ao adicionar o produto.",
        icon: "error",
        confirmButtonText: "Entendi",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StyledPaper sx={{ display: 'flex', flexDirection: 'column', height: '80vh', maxHeight: '90vh', minHeight: 400 }}>
      {/* Cabeçalho fixo */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          position: "sticky",
          top: 0,
          background: "rgba(255,248,225,0.98)",
          zIndex: 2,
          pb: 1,
        }}
      >
        <Typography variant="h5" fontWeight={700} color="#ff7043">
          <BakeryDining sx={{ mr: 1, verticalAlign: "middle" }} />
          Novo Produto
        </Typography>
        <IconButton onClick={CloseEvent} size="small" sx={{ color: "error.main" }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 3 }} />

      {/* Conteúdo rolável do formulário */}
      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', pr: 1 }}>
        <form onSubmit={handleSubmit} encType="multipart/form-data" style={{ height: '100%' }}>
          <Stack spacing={3} sx={{ pb: 2 }}>
            {/* Imagem */}
            <Box display="flex" flexDirection="column" alignItems="center">
              <Tooltip title="Selecione uma imagem para o produto" arrow>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<PhotoCamera />}
                  sx={{
                    mb: 1,
                    background: "linear-gradient(90deg, #ffa726 0%, #ff7043 100%)",
                    color: "#fff",
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 3,
                    boxShadow: "0 2px 8px 0 rgba(255,167,38,0.10)",
                    "&:hover": {
                      background: "linear-gradient(90deg, #ff7043 0%, #ffa726 100%)",
                    },
                  }}
                >
                  Selecionar Foto
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImagemChange}
                  />
                </Button>
              </Tooltip>
              {preview && (
                <Box
                  component="img"
                  src={preview}
                  alt="Pré-visualização"
                  sx={{
                    width: 120,
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 3,
                    boxShadow: 2,
                    border: "2px solid #ff7043",
                    mt: 1,
                  }}
                />
              )}
            </Box>

            {/* Nome do Produto */}
            <TextField
              label="Nome do Produto"
              variant="outlined"
              size="small"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              fullWidth
              required
              inputProps={{ maxLength: 100 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BakeryDining color="warning" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Preço */}
            <TextField
              label="Preço"
              variant="outlined"
              size="small"
              value={preco}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d{0,2}$/.test(value)) {
                  setPreco(value);
                }
              }}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoney color="warning" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Categoria */}
            <FormControl fullWidth size="small">
              <InputLabel>Categoria</InputLabel>
              <Select
                value={categoria}
                label="Categoria"
                onChange={(e) => setCategoria(e.target.value)}
                required
              >
                {categorias.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Destaque */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={destaque}
                  onChange={(e) => setDestaque(e.target.checked)}
                  color="warning"
                />
              }
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <StarIcon fontSize="small" color={destaque ? "warning" : "action"} />
                  <Typography>Destacar este produto</Typography>
                </Stack>
              }
            />

            {/* Descrição */}
            <TextField
              label="Descrição"
              variant="outlined"
              size="small"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              fullWidth
              multiline
              minRows={2}
              maxRows={4}
              inputProps={{ maxLength: 300 }}
            />
          </Stack>
          {/* Espaço extra para garantir que o rodapé não sobreponha o conteúdo */}
          <Box sx={{ height: 70 }} />
        </form>
      </Box>

      {/* Botões fixos na parte inferior */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          pt: 3,
          mt: 2,
          borderTop: "1px solid rgba(255,167,38,0.2)",
          position: "sticky",
          bottom: 0,
          background: "rgba(255,248,225,0.98)",
          zIndex: 3,
        }}
      >
        <Button
          variant="outlined"
          onClick={CloseEvent}
          sx={{
            mr: 2,
            color: "error.main",
            borderColor: "error.main",
            fontWeight: 600,
            borderRadius: 2,
          }}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          sx={{
            minWidth: 120,
            background: "linear-gradient(90deg, #ffa726 0%, #ff7043 100%)",
            color: "#fff",
            fontWeight: 600,
            borderRadius: 2,
            boxShadow: "0 2px 8px 0 rgba(255,167,38,0.10)",
            "&:hover": {
              background: "linear-gradient(90deg, #ff7043 0%, #ffa726 100%)",
            },
          }}
          disabled={isSubmitting}
          form={undefined} // Garante submit correto
          onClick={(e) => {
            // Força submit do form
            e.preventDefault();
            handleSubmit(e);
          }}
        >
          {isSubmitting ? "Salvando..." : "Salvar"}
        </Button>
      </Box>
    </StyledPaper>
  );
}