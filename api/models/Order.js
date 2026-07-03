import { DataTypes } from "sequelize";
import { sequelize } from "../databases/conecta.js";

export const Order = sequelize.define("order", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  userId: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  items: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "paid", "failed"),
    defaultValue: "pending",
  },
  external_reference: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  preference_id: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
});
