const { dbInstances } = require("../models")
const { logger } = require("../src/utils/logger")

async function Subtraction(job,done){
    try{
        logger.info(`Processing Subtraction Job Id + ${JSON.stringify(job.id)} + '---->Data'+${JSON.stringify(job.data)}`)
        const a=3,b=5
        const sum = a+b
        logger.info(sum)
        done(null,{success: true,jobId: job.Id})
    }
    catch(err){
        logger.info(`Error for Subtraction App Queue ${err}`)
        done(err)
    }
}
exports.Subtraction = Subtraction