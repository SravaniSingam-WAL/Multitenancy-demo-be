const Arena = require('bull-arena');
const Bull = require('bull');
const QueueNames = Object.values(require('./index').queueNames);
const config = require('../config/config');
const {tenantDbs} = require('../config/db_config')


const arenas = tenantDbs.map((tenant) => {
    const [key,value]=tenant
  return {
    Bull,
    queues: QueueNames.map((val) => {
      return {
        name: val,
        hostId: `Cypresslawn_Jobs_${key}`,
        redis: {
          ...value.redis,
          db: value?.redis?.db || 0,
          host: value?.redis?.host || '127.0.0.1',
          port: value?.redis?.port || 6379,
        },
      };
    }),
  };
});

const arenaInstances = arenas.map((arenaConfig) => {
  return Arena(arenaConfig, {
    basePath: `/arena/${arenaConfig.hostId}`,
    disableListen: true,
  });
});

module.exports = arenaInstances;

