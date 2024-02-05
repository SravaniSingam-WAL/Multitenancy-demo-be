'use strict'
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            name : DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            brandName: DataTypes.STRING,
       //     role: DataTypes.STRING
        },
        {
            defaultScope: {
                order: null
            },
            tableName: 'User',
            timestamps: false
        }
    )
    User.associate = function (models) {
    }
    return User
}
