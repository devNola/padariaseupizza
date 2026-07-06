import { DataTypes } from 'sequelize';

export async function up({ context: queryInterface }) {
  await queryInterface.createTable('orders', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: { type: DataTypes.STRING(100), allowNull: false },
    items: { type: DataTypes.JSON, allowNull: false },
    total: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    status: { type: DataTypes.ENUM('pending','paid','failed'), defaultValue: 'pending' },
    external_reference: { type: DataTypes.STRING(100), allowNull: true },
    preference_id: { type: DataTypes.STRING(100), allowNull: true },
    init_point: { type: DataTypes.STRING(255), allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: new Date() },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: new Date() },
  });
}

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable('orders');
}
