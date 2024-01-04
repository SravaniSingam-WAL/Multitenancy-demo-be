const Queue = require("bull");
const _ = require("lodash");
const debug = require("debug")("oneportal");
const { tenantDbs } = require("../../config/db_config");

const queueNames = require("./queueName.constant");
const { logger } = require("../utils/logger");

class QueueManager {
  constructor() {
    this.tenantQueues = {};
    this.queues = {};
  }

  async init() {
    logger.info("Initializing the queue for each queue name");
    Object.entries(tenantDbs).map(async (tenant) => {
      const [key, value] = tenant;
      const queues = {};
      const queueCreationPromises = Object.keys(queueNames).map(
        async (queueNameKey) => {
          const queueName = queueNames[queueNameKey];

          debug(`Creating queue instance for queue name: "${queueName}"`);
          const queueInstance = new Queue(queueName, _.pick(value, ["redis"]));

          queues[queueName] = queueInstance;

          await queueInstance.isReady();
          debug(`Queue "${queueName}" is ready to process the job`);
        }
      );
      this.tenantQueues[key] = queues;
      return Promise.all(queueCreationPromises);
    });
    }

  getQueue(key, queueName) {
    return this.tenantQueues[key][queueName];
  }

  getQueues() {
    return this.tenantQueues;
  }

  registerQueueListeners() {
    logger.info("Registering common error handler listener for queue");
    this.queueInstance.on("error", function (error) {
      debug("error", error);
      logger.error("Failed to acquire queue connection.");

      // eslint-disable-next-line no-process-exit
      process.exit(1);
    });
  }
}

const queueManagerInstance = new QueueManager();

module.exports = queueManagerInstance;
