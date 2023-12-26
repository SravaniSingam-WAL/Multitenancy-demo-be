const Arena = require('bull-arena');
const Bull = require('bull');
const QueueNames = Object.values(require('./index').queueNames);
const config = require('../config/config');

const envConfig = config[process.env.NODE_ENV || 'development'];

let queues = QueueNames.map((val, index) => {
    return {
        name: val,
        hostId: 'Cypresslawn_Jobs',
        redis: {
            ...envConfig.redis,
            db: envConfig?.redis?.db || 0,
            maxRetriesPerRequest: null
        }
    }
})
module.exports = Arena(
    {
        Bull,
        queues: queues
    },
    {
        // Make the arena dashboard become available at {my-site.com}/arena.
        basePath: '/arena',
        disableListen: true
    }
)
