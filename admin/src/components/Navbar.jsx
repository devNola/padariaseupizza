import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Avatar from '@mui/material/Avatar';
import { useAppStore } from '../appStore';
import { useTheme } from '@mui/material/styles';

const CustomAppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  borderBottom: `1px solid ${theme.palette.divider}`,
  backdropFilter: 'blur(6px)',
  backgroundColor: 'transparent', // Deixe transparente para o gradiente do CSS pegar
}));

const Search = styled('div')(({ theme, clicked }) => ({
  position: 'relative',
  borderRadius: '12px',
  backgroundColor: alpha(theme.palette.action.hover, 0.1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.action.hover, 0.15),
  },
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(2),
  width: clicked ? '320px' : '200px',
  transition: theme.transitions.create(['width', 'background-color'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard,
  }),
  [theme.breakpoints.down('sm')]: {
    marginLeft: theme.spacing(1),
    width: clicked ? '180px' : '36px',
    borderRadius: '50%',
    '&:focus-within': {
      width: '180px',
      borderRadius: '12px',
    },
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary,
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 1, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    fontSize: '0.875rem',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
    '&::placeholder': {
      opacity: 0.8,
      color: theme.palette.text.secondary,
    },
  },
}));

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [searchClicked, setSearchClicked] = React.useState(false);
  const updateOpen = useAppStore((state) => state.updateOpen);
  const dopen = useAppStore((state) => state.dopen);
  const theme = useTheme();

  const isMenuOpen = Boolean(anchorEl);
  const handleMenuClose = () => setAnchorEl(null);

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
      PaperProps={{
        elevation: 4,
        sx: {
          mt: 1.5,
          minWidth: 220,
          borderRadius: '14px',
          overflow: 'visible',
          boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
        },
      }}
    >
      <MenuItem onClick={handleMenuClose}>Meu Perfil</MenuItem>
      <MenuItem onClick={handleMenuClose}>Configurações</MenuItem>
      <MenuItem divider />
      <MenuItem
        onClick={handleMenuClose}
        sx={{ color: theme.palette.error.main, fontWeight: 600 }}
      >
        Sair
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <CustomAppBar position="fixed" className="padaria-navbar" sx={{ color: theme.palette.text.primary }}>
        <Toolbar sx={{ minHeight: '64px', px: { xs: 1, sm: 2 } }}>
          <IconButton
            size="medium"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={() => updateOpen(!dopen)}
            sx={{
              mr: 1,
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
              },
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box
            component="a"
            href="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: theme.palette.text.primary,
              mr: 2,
              flexShrink: 0,
            }}
          >
            <Avatar
              src="logo-padaria.jpg"
              alt="Logo Padaria Seu Pizza"
              sx={{
                width: 36,
                height: 36,
                mr: 1.5,
                boxShadow: theme.shadows[1],
              }}
            />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                display: { xs: 'none', sm: 'block' },
                fontWeight: 700,
                letterSpacing: '0.5px',
                fontSize: '1.1rem',
                color: theme.palette.text.primary,
              }}
            >
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Busca só em telas médias/grandes */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', mr: 2 }}>
            <Search clicked={searchClicked}>
              <SearchIconWrapper>
                <SearchIcon fontSize="small" />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Pesquisar..."
                inputProps={{ 'aria-label': 'search' }}
                onFocus={() => setSearchClicked(true)}
                onBlur={() => setSearchClicked(false)}
              />
            </Search>
          </Box>
        </Toolbar>
      </CustomAppBar>
      {renderMenu}
    </Box>
  );
};

export default Navbar;