const { logger } =require('../src/utils/logger')

async function Addition(job,done){
    try{
        logger.info(`Processing Addition Job Id + ${JSON.stringify(job.id)} + '---->'+${JSON.stringify(job.data)}`)
        const a=3,b=5
        const sum = a+b
        logger.info(sum)
        done(null,{success: true,jobId: job.Id})
    }
    catch(err){
        logger.info(`Error for Addition App Queue ${err}`)
        done(error)
    }
}
exports.Addition = Addition