import { DataTypes } from 'sequelize';
import { sequelize } from '../databases/conecta.js';

export const Cliente = sequelize.define('cliente', {
  id: {
    type: DataTypes.STRING(100),
    primaryKey: true,
    allowNull: false
  },
  senha: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  nome: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  token: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true, // Garante que o e-mail seja único
  },
  admin: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
});
