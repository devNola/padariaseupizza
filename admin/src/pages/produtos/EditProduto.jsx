import React, { useState, useEffect } from "react";
import {
    IconButton,
    Box,
    Grid,
    Typography,
    TextField,
    Button,
    MenuItem,
    InputAdornment,
    CircularProgress,
    Paper,
    styled,
    Divider,
} from "@mui/material";
import { Close as CloseIcon, BakeryDining, AttachMoney } from "@mui/icons-material";
import Swal from "sweetalert2";
import axios from "axios";

const StyledPaper = styled(Paper)(({ theme }) => ({
    position: "relative",
    maxWidth: 520,
    margin: "auto",
    padding: theme.spacing(5, 4, 4, 4),
    borderRadius: 18,
    boxShadow: "0 8px 32px 0 rgba(255,167,38,0.15)",
    background: "rgba(255,248,225,0.98)", // igual ao AddProduto
    // Remove borda branca
    border: "none",
}));

export default function EditProduto({ CloseEvent, produto, onProductUpdated }) {
    // Hooks SEMPRE no topo
    const [nome, setNome] = useState("");
    const [preco, setPreco] = useState("");
    const [categoria, setCategoria] = useState("");
    const [descricao, setDescricao] = useState("");
    const [imagem, setImagem] = useState(null); // Novo estado para imagem
    const [preview, setPreview] = useState(""); // Prévia da imagem
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!produto) return;
        setNome(produto.nome || "");
        setPreco(produto.preco || "");
        setCategoria(produto.categoria || "");
        setDescricao(produto.descricao || "");
        setPreview(
            produto.imagem?.startsWith("http")
                ? produto.imagem
                : produto.imagem
                    ? `http://localhost:55000/uploads/${produto.imagem}`
                    : ""
        );
        setImagem(null); // Limpa imagem ao trocar produto
    }, [produto]);
    // Removido o return null condicional, a checagem deve ser feita no componente pai

    const handleNomeChange = (event) => setNome(event.target.value);
    const handlePrecoChange = (event) => {
        const value = event.target.value;
        if (/^\d*\.?\d*$/.test(value)) setPreco(value);
    };
    const handleCategoriaChange = (event) => setCategoria(event.target.value);

    // Novo handler para upload de imagem
    const handleImagemChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImagem(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const validateInputs = () => {
        if (!nome.trim()) {
            Swal.fire("Erro!", "O campo Nome é obrigatório.", "error");
            return false;
        }
        if (!preco || isNaN(preco) || parseFloat(preco) <= 0) {
            Swal.fire("Erro!", "Insira um preço válido.", "error");
            return false;
        }
        if (!categoria) {
            Swal.fire("Erro!", "Selecione uma categoria.", "error");
            return false;
        }
        return true;
    };

    const updateProduto = async () => {
        if (!validateInputs()) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("nome", nome);
            formData.append("preco", parseFloat(preco));
            formData.append("categoria", categoria);
            formData.append("data", produto.data);
            formData.append("descricao", descricao);
            if (imagem) {
                formData.append("imagem", imagem);
            }

            const response = await axios.put(
                `http://localhost:55000/alterar/${produto.id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 200) {
                Swal.fire("Sucesso!", "Produto atualizado com sucesso!", "success");
                onProductUpdated();
                CloseEvent();
            }
        } catch (error) {
            Swal.fire(
                "Erro!",
                error.response?.data?.message || "Falha ao atualizar o produto. Tente novamente.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    const categorias = [
        { value: "Pães", label: "Pães" },
        { value: "Doces", label: "Doces" },
        { value: "Bebidas", label: "Bebidas" },
        { value: "Salgados", label: "Salgados" },
    ];

    return (
        <StyledPaper>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h5" fontWeight={700} color="orange">
                    Editar Produto
                </Typography>
                <IconButton onClick={CloseEvent} size="small" sx={{ color: "error.main" }}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
                <Grid item xs={12} display="flex" justifyContent="center">
                    {preview && (
                        <Box
                            sx={{
                                mb: 2,
                                borderRadius: 2,
                                overflow: "hidden",
                                boxShadow: "0 4px 16px 0 rgba(160,82,45,0.10)",
                                background: "#fff",
                                p: 1,
                            }}
                        >
                            <img
                                src={preview}
                                alt={nome}
                                style={{
                                    width: 120,
                                    height: 120,
                                    objectFit: "cover",
                                    borderRadius: 8,
                                }}
                            />
                        </Box>
                    )}
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        sx={{ mb: 1 }}
                    >
                        Trocar Foto
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleImagemChange}
                        />
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Nome do Produto"
                        variant="outlined"
                        size="small"
                        onChange={handleNomeChange}
                        value={nome}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <BakeryDining color="warning" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Preço"
                        variant="outlined"
                        type="text"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AttachMoney color="warning" />
                                </InputAdornment>
                            ),
                        }}
                        size="small"
                        onChange={handlePrecoChange}
                        value={preco}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Categoria"
                        select
                        variant="outlined"
                        size="small"
                        onChange={handleCategoriaChange}
                        value={categoria}
                        fullWidth
                    >
                        {categorias.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Descrição"
                        variant="outlined"
                        size="small"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        fullWidth
                        multiline
                        minRows={3}
                        maxRows={6}
                        inputProps={{ maxLength: 300 }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Box display="flex" justifyContent="center" mt={2}>
                        <Button
                            variant="contained"
                            sx={{
                                background: "linear-gradient(90deg, #ffa726 0%, #ff7043 100%)",
                                color: "#fff",
                                fontWeight: 600,
                                px: 5,
                                py: 1.5,
                                borderRadius: 2,
                                fontSize: "1rem",
                                boxShadow: "0 2px 8px 0 rgba(255,167,38,0.10)",
                                "&:hover": {
                                    background: "linear-gradient(90deg, #ff7043 0%, #ffa726 100%)",
                                },
                            }}
                            onClick={updateProduto}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Salvar Alterações"}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </StyledPaper>
    );
}
