import { Sequelize, DataTypes } from "sequelize";

export default (sequelize) => {
    const Expense = sequelize.define('Expense', {
        expense_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'User',
                key: 'user_id'
            }
        },
        category_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Category',
                key: 'category_id'
            }
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING
        }
    }, {
        timestamps: true
    });

    Expense.associate = function (models) {
        Expense.belongsTo(models.User, { foreignKey: 'user_id' });
        Expense.belongsTo(models.Category, { foreignKey: 'category_id' });
    };

    return Expense;
};
