const { logger } =require('../src/utils/logger')

async function Multiplication(job,done){
    try{
        logger.info(`Processing Multiplication Job Id + ${JSON.stringify(job.id)} + '---->'+${JSON.stringify(job.data)}`)
        const a=3,b=5
        const sum = a+b
        logger.info(sum)
        done(null,{success: true,jobId: job.Id})
    }
    catch(err){
        logger.info(`Error for Multiplication App Queue ${err}`)
        done(error)
    }
}
exports.Multiplication = Multiplication