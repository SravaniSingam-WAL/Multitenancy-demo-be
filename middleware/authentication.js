const jwt = require("jsonwebtoken");
const { dbInstances } = require("../models")

async function authentication(req,res,next){
    const receivedToken = req.headers.authorization
    const tenantId = req.headers["tenantid"];
    console.log(tenantId)
    try{
        if(receivedToken){
            const decodedToken = jwt.verify(receivedToken, "secret_token")
            const user = await dbInstances[tenantId].User.findOne({
                where:{
                    email:decodedToken.id
                }
            })
            console.log('User : ',user)
            if(user){
                req.currentUser=1
                next()
            }
            else{
                res.status(401).json({
                    message: 'User not found'
                })       
            }
        }else {
            res.status(401).json({
                message: 'Token not found'
            })
        }
    }
    catch(error){
        if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                message: error.message
            })
            return
        }
        next(error) 
    }
}
module.exports = {authentication}