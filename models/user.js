'use strict'
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            email: DataTypes.STRING,
            password: DataTypes.STRING
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
