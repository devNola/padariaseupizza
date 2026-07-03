import React from 'react';
import Sidenav from '../components/Sidenav';
import Navbar from '../components/Navbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ProdutosList from './produtos/ProdutosList';

const Produtos = () => {
  return (
    <div className="bgcolor">
      <Navbar />
      <Box height={70} />
      <Box sx={{ display: 'flex' }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Lista de Produtos
          </Typography>
          <ProdutosList />
        </Box>
      </Box>
    </div>
  );
}

export default Produtos;
