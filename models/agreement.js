'use strict'
module.exports = (sequelize, DataTypes) => {
    const Agreement = sequelize.define(
        'Agreement',
        {
            contractNumber: DataTypes.STRING,
            userId: DataTypes.INTEGER
        },
        {
            defaultScope: {
                order: null
            },
            tableName: 'Agreement',
            timestamps: false
        }
    )
    Agreement.associate = function (models) {
        Agreement.belongsTo(models.User, {
            foreignKey: 'userId'
        });
    }
    return Agreement
}
