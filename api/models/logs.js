import { DataTypes } from 'sequelize';
import { sequelize } from '../databases/conecta.js';

export const Logs = sequelize.define('log', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  usuario: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  descricao: {
    type: DataTypes.TEXT, // Alterado de STRING(255) para TEXT
    allowNull: false,
  },
  data: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});