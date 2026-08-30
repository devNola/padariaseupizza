import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Avatar,
} from '@mui/material';
import { EventNote, BakeryDining } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import Sidenav from '../components/Sidenav';
import { api } from '../services/api';
import '../Dash.css';

export default function Home() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDados() {
      setLoading(true);
      try {
        const resLogs = await api.get('/logs');
        setLogs(resLogs.data.logs);
      } catch {
        setLogs([]);
      }
      setLoading(false);
    }
    fetchDados();
  }, []);

  const logsOrdenados = [...logs].sort((a, b) => new Date(b.data) - new Date(a.data));

  const logsClientes = logsOrdenados.filter(log => {
    const desc = log.descricao.toLowerCase();
    // Só pega logs que começam com "cliente" (login/cadastro)
    return (
      (desc.startsWith("cliente") && (
        desc.includes("login") ||
        desc.includes("logou") ||
        desc.includes("cadastrado") ||
        desc.includes("cadastrou")
      ))
    );
  });

  const logsAtividades = logsOrdenados.filter(log => !logsClientes.includes(log));

  return (
    <Box className="bgcolor" sx={{ minHeight: '100vh' }}>
      <Navbar />
      <Box sx={{ display: 'flex' }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Typography className="home-title">
            Bem-vindo ao Painel da Padaria
          </Typography>
          <Grid container spacing={3}>
            {/* Card de Clientes */}
            <Grid item xs={12} md={4}>
              <Card className="card-container card-dashboard">
                <CardContent>
                  <Box className="card-content" sx={{ mb: 2 }}>
                    <Avatar className="iconstyle" sx={{ bgcolor: "#ffe0b2" }}>
                      <BakeryDining sx={{ color: "#a0522d" }} />
                    </Avatar>
                    <Typography variant="h6" sx={{ ml: 2 }}>
                      Clientes Cadastrados
                    </Typography>
                  </Box>
                  <Divider />
                  <List>
                    {logsClientes.length === 0 && (
                      <Typography variant="body2" color="text.secondary" align="center">
                        Nenhum cliente cadastrado ou logado.
                      </Typography>
                    )}
                    {logsClientes.slice(0, 8).map((log, idx) => (
                      <React.Fragment key={idx}>
                        <ListItem disablePadding>
                          <ListItemText
                            primary={log.descricao}
                            secondary={new Date(log.data).toLocaleString('pt-BR')}
                          />
                        </ListItem>
                        {idx < logsClientes.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Card de Últimas Atividades */}
            <Grid item xs={12} md={8}>
              <Card className="card-container card-dashboard">
                <CardContent>
                  <Box className="card-content" sx={{ mb: 2 }}>
                    <Avatar className="iconstyle" sx={{ bgcolor: "#ffe0b2" }}>
                      <EventNote sx={{ color: "#a0522d" }} />
                    </Avatar>
                    <Typography variant="h6" sx={{ ml: 2 }}>
                      Últimas Atividades
                    </Typography>
                  </Box>
                  <Divider />
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                      <CircularProgress color="warning" />
                    </Box>
                  ) : (
                    <List>
                      {logsAtividades.length === 0 && (
                        <Typography variant="body2" color="text.secondary" align="center">
                          Nenhuma atividade recente.
                        </Typography>
                      )}
                      {logsAtividades.slice(0, 8).map((log, idx) => (
                        <React.Fragment key={idx}>
                          <ListItem disablePadding>
                            <ListItemText
                              primary={log.descricao}
                              secondary={new Date(log.data).toLocaleString('pt-BR')}
                            />
                          </ListItem>
                          {idx < logsAtividades.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}