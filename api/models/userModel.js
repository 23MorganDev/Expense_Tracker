import { DataTypes, Sequelize } from "sequelize";

export default (Sequelize, DataTypes) => {
    const User = Sequelize.define('User', {
        user_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE
        }, 
            timestamps: false
          });

          User.associate = function(models) {
            User.hasMany(models.Expense, { foreignKey: 'user_id'});
            User.hasMany(models.Category, {foreignKey: 'user_id'});
            User.hasMany(models.PaymentMethod, {foreignKey: 'user_id'});
            User.hasMany(models.Budget, {foreignKey: 'user_id'});
          }

          return User
}