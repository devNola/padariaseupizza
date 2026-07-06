import { DataTypes } from 'sequelize';

export async function up({ context: queryInterface }) {
  await queryInterface.createTable('notifications', {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    notification_id: { type: DataTypes.STRING(128), allowNull: false, unique: true },
    topic: { type: DataTypes.STRING(64), allowNull: true },
    payload: { type: DataTypes.JSON, allowNull: true },
    processed_at: { type: DataTypes.DATE, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: new Date() },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: new Date() },
  });
  await queryInterface.addIndex('notifications', ['notification_id'], { unique: true, name: 'notifications_notification_id_unique' });
}

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable('notifications');
}
