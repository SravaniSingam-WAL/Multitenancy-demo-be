const Arena = require('bull-arena');
const Bull = require('bull');
const QueueNames = Object.values(require('./index').queueNames);
const { tenantDbs } = require('../config/db_config');

const arenaInstances = Object.entries(tenantDbs).map((tenant) => {
  const [key, value] = tenant;
  return Arena(
    {
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
    },
    {
      basePath: `/arena/${key}`,
      disableListen: true,
    }
  );
});

module.exports = arenaInstances;
