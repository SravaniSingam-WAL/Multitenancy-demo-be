const queueNames = require('../src/app_queue/queueName.constant')
const queueManager = require('../src/app_queue/queueManager')

const { Addition } = require('./addition')
const { Subtraction } = require('./subtraction')
const { Multiplication } = require('./multiplication')

const {logger} = require('../src/utils/logger')

const queues = queueManager.getQueues()
const jobStartTimes = new Map()
const onJobCompleted = (queueName, job) =>{
    const startTime = jobStartTimes.get(job.id)
    if(startTime){
    const endTime = Date.now()
    const executionTime = endTime - startTime
    logger.info(`Job in queue ${queueName} completed in ${executionTime}ms. Job ID: ${job.id}`)
    jobStartTimes.delete(job.id)
    }
}

const onJobFailed = (queueName, job, error) =>{
    const startTime =jobStartTimes.get(job.id)
    if(startTime){
        const endTime = Date.now()
        const executionTime = endTime - startTime
        logger.error(`Job in queue ${queueName} failed in ${executionTime}ms due to ${error}`)
        jobStartTimes.delete(job.id)
    }
}

function bootstrap(){
    Object.values(queueNames).forEach(queueName =>{
        const newQueue = queueManager.getQueue(queueName)

        newQueue.on('active', job => {
            jobStartTimes.set(job.id, Date.now())
        })

        newQueue.on('completed', (job, result) => {
            onJobCompleted(queueName, job)
        })
        newQueue.on('failed', (job, error) => {
            onJobFailed(queueName, job, error)
        })
        newQueue.on('delayed', (job, result) => {
            logger.warn(`Job in queue ${queueName} delayed for too long. Job ID: ${job.id}`)
        })

        newQueue.on('error', function (error) {
            logger.error('error', error)
            logger.error('Failed to acquire queue connections with Redis queue.')
            process.exit(1)
        })
    
    })
    queues[queueNames.addition].process('Addition',Addition)

    queues[queueNames.subtraction].process(Subtraction)
    queues[queueNames.subtraction].add({},{repeat: { cron : '5 * * * *'}})
 
    queues[queueNames.multiplication].process(Multiplication)
    queues[queueNames.multiplication].add({},{repeat: { cron : '5 * * * *'}})
 
}

bootstrap()
module.exports={
    queues,queueNames
}