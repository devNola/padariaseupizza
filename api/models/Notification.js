import { DataTypes } from "sequelize";
import { sequelize } from "../databases/conecta.js";

export const Notification = sequelize.define("notification", {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  notification_id: {
    type: DataTypes.STRING(128),
    allowNull: false,
    unique: true,
  },
  topic: {
    type: DataTypes.STRING(64),
    allowNull: true,
  },
  payload: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  processed_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});
