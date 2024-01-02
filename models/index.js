const Sequelize = require('sequelize')
const {tenantDbs} = require('../config/db_config')
const dbInstances = {};

Object.entries(tenantDbs).forEach((tenant)=>{
    const [key,value]=tenant
    let db={}
    const sequelizeIns = new Sequelize(value.database, value.username, value.password,value);
    db.sequelize = sequelizeIns;
    db.Agreement= require("./agreement")(sequelizeIns, Sequelize);
    db.User = require("./user.js")(sequelizeIns, Sequelize);
    dbInstances[key]=db
})


module.exports = {dbInstances};