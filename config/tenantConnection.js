const Sequelize = require('sequelize')
const {envConfig } = require('./db_config')
const db = {}
console.log(envConfig,'---------')
let sequelize = new Sequelize(envConfig.database, envConfig.username, envConfig.password, envConfig)

db.sequelize = sequelize

module.exports = db
