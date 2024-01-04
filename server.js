const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { dbInstances } = require("./models");
const { authentication } = require("./middleware/authentication");
app.use(express.json());
app.use(cors());
const initializeSearch = require('./common/initalize_search')
const esAgreement = require('./src/elastic/agreement')
const { getIndexName } =require('./src/utils')
const areaMiddleware = require('./appQueues/arenaConfig')
const queueNames = require('./src/app_queue/queueName.constant')
const queueManager = require('./src/app_queue/queueManager')

const tenantQueues = queueManager.getQueues()

app.get("/", async (req, res) => {
    res.json("hello world");
});

app.use('/',areaMiddleware)

app.get("/api/add", authentication,async (req, res) => {
    const tenantId = req.headers["tenantid"];

try{
    const AdditionWorker = tenantQueues[tenantId][queueNames.addition]
    await AdditionWorker.add('AdditionQueue',tenantId)
    res.status(200).json({
        success: true,
        data: 'Queue was add successfully',
    });

}catch(err){
    res.status(401).json({
        success: false,
        message: 'Invalid tenantId',
    });

}
});

app.get("/api/agreements", authentication,async (req, res) => {
    const tenantId = req.headers["tenantid"];
try{
    const agreementDetails = await dbInstances[tenantId].Agreement.findAll()
    res.status(200).json({
        success: true,
        data: agreementDetails,
    });

}catch(err){
    res.status(401).json({
        success: false,
        message: 'Invalid tenantId',
    });

}
});


app.get("/api/agreement/:contractNumber", authentication,async (req, res) => {
    const tenantId = req.headers["tenantid"];
 try{
    const indexName = getIndexName(tenantId)
  
    let boolQuery = {
        bool: {
            must: [ {
        query_string: {
            query: `${req.params.contractNumber}*`,
            fields: ['contractNumber']
        }
    }
    ],
    }
    }
    try{
    const searchResults = await esAgreement.client.search({
        index: indexName,
        body:{
            from : 0,
            size: 5,
            query: boolQuery
        }
    }) 
    const searchData = await Promise.all(searchResults.hits.hits.map(async record => {
        const agreementDetails = await dbInstances[tenantId].Agreement.findOne({
            where : {
                id: record._source.id
            }
        })
        return agreementDetails
    }))
    console.log(searchData)
    res.status(200).json({
        success: true,
        totalResults: searchResults.hits.total,
        data: searchData.filter(Boolean),
    });
}catch(error){
    console.log(error)
}
}catch(err){
    console.log(err)
    res.status(401).json({
        success: false,
        message: 'Invalid tenantId',
    });

}
});

app.post("/api/agreement", authentication,async (req, res) => {
    const tenantId = req.headers["tenantid"];
    const agreementData = {'id':req.body.contractInfo.id,'contractNumber': req.body.contractInfo.contractNumber,'userId':tenantId}
   try{
    let agreementDetails
    if(!req.body.contractInfo.id){
        agreementDetails = await dbInstances[tenantId].Agreement.create(agreementData)
     }
    const indexName = getIndexName(tenantId)
    await esAgreement.save(indexName, agreementDetails || agreementData)
    res.status(200).json({
        success: true,
        data: 'inserted data in ES'
    });

}catch(err){
    console.log(err)
    res.status(401).json({
        success: false,
        message: 'Invalid tenantId',
    });

}
});
app.post("/api/login", async (req, res) => {
    const secretToken = "secret_token";
    const expireTime = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
    const { username, password } = req.body;
    const tenantId = req.headers["tenantid"];
  
    try {
        const user = await dbInstances[tenantId].User.findOne({
            where: {
                email: username,
                password: password
            },
        });
        if (user) {
            const token = jwt.sign(
                {
                    id: username,
                    exp: expireTime,
                    tenantId,
                },
                secretToken
            );
            res.status(200).json({
                success: true,
                user: {
                    email: username,
                    token: token,
                },
            });
        } else {
            res.status(401).json({
                success: false,
                message: "Invalid username or password",
            });
        }
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid username or password",
        });
    }
});

app.listen(3030, async () => {
    console.log("server started on 3030");
    initializeSearch();
    });
