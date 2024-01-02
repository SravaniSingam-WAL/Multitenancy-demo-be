const Queue = require('bull');
const _ = require('lodash');
const debug = require('debug')('oneportal');

const config = require('../../config/config');
const queueNames = require('./queueName.constant');
const { logger } = require('../../lib/ApplicationInsightsLogger');

class QueueManager {
  constructor () {
    this.queues = {};
  }

  async init () {
    logger.info('Initializing the queue for each queue name');
    const queueCreationPromises = Object.keys(queueNames).map(async (queueNameKey) => {
      const queueName = queueNames[queueNameKey];
      const envConfig = config[process.env.NODE_ENV || 'development'];

      debug(`Creating queue instance for queue name: "${queueName}"`);
      const queueInstance = new Queue(queueName, _.pick(envConfig, ['redis']));

      this.queues[queueName] = queueInstance;

      await queueInstance.isReady();
      debug(`Queue "${queueName}" is ready to process the job`);
    });

    return Promise.all(queueCreationPromises);
  }

  getQueue (queueName) {
    return this.queues[queueName];
  }

  getQueues () {
    return this.queues;
  }

  registerQueueListeners () {
    logger.info('Registering common error handler listener for queue');
    this.queueInstance.on('error', function (error) {
      debug('error', error);
      logger.error('Failed to acquire queue connection.');

      // eslint-disable-next-line no-process-exit
      process.exit(1);
    });
  }
}

const queueManagerInstance = new QueueManager();

module.exports = queueManagerInstance;
