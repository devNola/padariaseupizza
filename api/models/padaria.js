import { DataTypes } from "sequelize";
import { sequelize } from "../databases/conecta.js";

export const Padaria = sequelize.define(
  "padaria",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    categoria: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    preco: {
      type: DataTypes.DECIMAL(9, 2),
      allowNull: false,
    },
    data: {
      type: DataTypes.STRING,
      defaultValue: "01/01/2000",
      allowNull: false,
    },
    destaque: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    imagem: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    descricao: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    paranoid: true,
  }
);
