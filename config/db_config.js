const tenantDbs = {
1: {
  host: "localhost",
  username: "sa",
  password: "MyPassword123#",
  database: "Tenant_one",
  dialect: "mssql",
  seederStorage: 'sequelize',
  seederStorageTableName: 'SequelizeData',
  archiveTimePeriod: 30,
  databaseVersion: '11.0.0',
  define: {
    timestamps: true
},
  dialectOptions: {
    options: {
        requestTimeout: 300000,
        cancelTimeout: 10000,
        packetSize: 16368, // To avoid ECONNRESET
        maxRetriesOnTransientErrors: 5 // More breathing space before getting ETIMEOUT
    }
},
  pool: {
    max: 250,
    min: 0,
    acquire: 60000,
    idle: 10000
  }
},
2:{
  host: "localhost",
  username: "sa",
  password: "MyPassword123#",
  database: "Tenant_two",
  dialect: "mssql",
  seederStorage: 'sequelize',
  seederStorageTableName: 'SequelizeData',
  archiveTimePeriod: 30,
  databaseVersion: '11.0.0',
  define: {
    timestamps: true
},
  dialectOptions: {
    options: {
        requestTimeout: 300000,
        cancelTimeout: 10000,
        packetSize: 16368, // To avoid ECONNRESET
        maxRetriesOnTransientErrors: 5 // More breathing space before getting ETIMEOUT
    }
},
  pool: {
    max: 250,
    min: 0,
    acquire: 60000,
    idle: 10000
  }
},
3:{
  host: "localhost",
  username: "sa",
  password: "MyPassword123#",
  database: "Tenant_three",
  dialect: "mssql",
  seederStorage: 'sequelize',
  seederStorageTableName: 'SequelizeData',
  archiveTimePeriod: 30,
  databaseVersion: '11.0.0',
  define: {
    timestamps: true
},
  dialectOptions: {
    options: {
        requestTimeout: 300000,
        cancelTimeout: 10000,
        packetSize: 16368, // To avoid ECONNRESET
        maxRetriesOnTransientErrors: 5 // More breathing space before getting ETIMEOUT
    }
},
  pool: {
    max: 250,
    min: 0,
    acquire: 60000,
    idle: 10000
  }
},
4:{
  host: "localhost",
  username: "sa",
  password: "MyPassword123#",
  database: "Tenant_four",
  dialect: "mssql",
  seederStorage: 'sequelize',
  seederStorageTableName: 'SequelizeData',
  archiveTimePeriod: 30,
  databaseVersion: '11.0.0',
  define: {
    timestamps: true
},
  dialectOptions: {
    options: {
        requestTimeout: 300000,
        cancelTimeout: 10000,
        packetSize: 16368, // To avoid ECONNRESET
        maxRetriesOnTransientErrors: 5 // More breathing space before getting ETIMEOUT
    }
},
  pool: {
    max: 250,
    min: 0,
    acquire: 60000,
    idle: 10000
  }
},
5:{
  host: "localhost",
  username: "sa",
  password: "MyPassword123#",
  database: "Tenant_five",
  dialect: "mssql",
  seederStorage: 'sequelize',
  seederStorageTableName: 'SequelizeData',
  archiveTimePeriod: 30,
  databaseVersion: '11.0.0',
  define: {
    timestamps: true
},
  dialectOptions: {
    options: {
        requestTimeout: 300000,
        cancelTimeout: 10000,
        packetSize: 16368, // To avoid ECONNRESET
        maxRetriesOnTransientErrors: 5 // More breathing space before getting ETIMEOUT
    }
},
  pool: {
    max: 250,
    min: 0,
    acquire: 60000,
    idle: 10000
  }
}}
  
module.exports = {tenantDbs}
