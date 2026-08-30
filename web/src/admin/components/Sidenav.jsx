import * as React from 'react';
import { styled, useTheme, alpha } from '@mui/material/styles'; // Adicionado alpha aqui
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import StoreIcon from '@mui/icons-material/Store';
import SettingsIcon from '@mui/icons-material/Settings';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../appStore';
import Avatar from '@mui/material/Avatar';

const drawerWidth = 260;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: 'transparent', // Deixe transparente
  borderRight: 'none',
  boxShadow: theme.shadows[3],
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(8)} + 1px)`,
  backgroundColor: 'transparent', // Deixe transparente
  borderRight: 'none',
  boxShadow: theme.shadows[3],
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 2),
  ...theme.mixins.toolbar,
  minHeight: '80px !important',
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
  })
);

const menuItems = [
  { text: 'Dashboard', icon: <HomeIcon />, route: '/admin' },
  { text: 'Produtos', icon: <StoreIcon />, route: '/admin/produtos' },
  { text: 'Configurações', icon: <SettingsIcon />, route: '/admin' },
];

export default function MiniDrawer() {
  const theme = useTheme();
  const navigate = useNavigate();
  const open = useAppStore((state) => state.dopen);
  const updateOpen = useAppStore((state) => state.updateOpen);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer variant="permanent" open={open} className="padaria-sidenav">
        <DrawerHeader>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            width: '100%',
            justifyContent: open ? 'flex-start' : 'center',
            px: open ? 2 : 0
          }}>
            <Avatar
              sx={{
                width: open ? 40 : 36,
                height: open ? 40 : 36,
                transition: 'all 0.3s ease',
                boxShadow: theme.shadows[2],
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText
              }}
            >
              SP
            </Avatar>
            {open && (
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  letterSpacing: '0.5px'
                }}
              >
                Seu Pizza
              </Typography>
            )}
          </Box>
          <IconButton
            onClick={() => updateOpen(!open)}
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: alpha(theme.palette.action.hover, 0.1),
              }
            }}
          >
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider sx={{ borderColor: theme.palette.divider }} />
        <List sx={{ px: 1 }}>
          {menuItems.map((item, index) => (
            <Tooltip
              key={index}
              title={!open ? item.text : ''}
              placement="right"
              arrow
            >
              <ListItem
                disablePadding
                sx={{
                  display: 'block',
                  mb: 0.5,
                  '&:last-child': {
                    mt: 2,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    pt: 2
                  }
                }}
                onClick={() => navigate(item.route)}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    px: 2.5,
                    borderRadius: '8px',
                    justifyContent: open ? 'initial' : 'center',
                    color: theme.palette.text.secondary,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                    },
                    '&.Mui-selected': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.15),
                      color: theme.palette.primary.main,
                      '& .MuiListItemIcon-root': {
                        color: theme.palette.primary.main,
                      }
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.2),
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      justifyContent: 'center',
                      color: 'inherit',
                      mr: open ? 3 : 'auto',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: '0.875rem'
                    }}
                    sx={{
                      opacity: open ? 1 : 0,
                      transition: 'opacity 0.2s ease-in-out',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}