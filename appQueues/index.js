const queueNames = require("../src/app_queue/queueName.constant");
const queueManager = require("../src/app_queue/queueManager");

const { Addition } = require("./addition");
const { Subtraction } = require("./subtraction");
const { Multiplication } = require("./multiplication");
const { tenantDbs } = require("../config/db_config");

const { logger } = require("../src/utils/logger");

const tenantQueues = queueManager.getQueues();
const jobStartTimes = new Map();
const onJobCompleted = (queueName, job) => {
  const startTime = jobStartTimes.get(job.id);
  if (startTime) {
    const endTime = Date.now();
    const executionTime = endTime - startTime;
    logger.info(
      `Job in queue ${queueName} completed in ${executionTime}ms. Job ID: ${job.id}`
    );
    jobStartTimes.delete(job.id);
  }
};

const onJobFailed = (queueName, job, error) => {
  const startTime = jobStartTimes.get(job.id);
  if (startTime) {
    const endTime = Date.now();
    const executionTime = endTime - startTime;
    logger.error(
      `Job in queue ${queueName} failed in ${executionTime}ms due to ${error}`
    );
    jobStartTimes.delete(job.id);
  }
};

async function bootstrap() {
    await queueManager.init();
    console.log('Queue initialization completed successfully.')
    Object.entries(tenantDbs).forEach((tenant) => {
    const [key, value] = tenant;
    Object.values(queueNames).forEach((queueName) => {
      const newQueue = queueManager.getQueue(key, queueName);

      newQueue.on("active", (job) => {
        jobStartTimes.set(job.id, Date.now());
      });

      newQueue.on("completed", (job, result) => {
        onJobCompleted(queueName, job);
      });
      newQueue.on("failed", (job, error) => {
        onJobFailed(queueName, job, error);
      });
      newQueue.on("delayed", (job, result) => {
        logger.warn(
          `Job in queue ${queueName} delayed for too long. Job ID: ${job.id}`
        );
      });

      newQueue.on("error", function (error) {
        logger.error("error", error);
        logger.error("Failed to acquire queue connections with Redis queue.");
        process.exit(1);
      });
    });
    tenantQueues[key][queueNames.addition].process("AdditionQueue", Addition);

    tenantQueues[key][queueNames.subtraction].process(Subtraction);
    tenantQueues[key][queueNames.subtraction].add(
      key,
      { repeat: { cron: "*/2 * * * *" } }
    );

    tenantQueues[key][queueNames.multiplication].process(Multiplication);
    tenantQueues[key][queueNames.multiplication].add(
      key,
      { repeat: { cron: "*/2 * * * *" } }
    );
  });
}

bootstrap();
module.exports = {
  tenantQueues,
  queueNames,
};
