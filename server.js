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
app.get("/", async (req, res) => {
    console.log("Hello world");
    res.json("hello world");
});

app.get("/api/agreements", authentication,async (req, res) => {
    const tenantId = req.headers["tenantid"];
    console.log(tenantId);
try{
    const agreementDetails = await dbInstances[tenantId].Agreement.findAll()
    res.status(200).json({
        success: true,
        data: agreementDetails,
    });

}catch(err){
    console.log(err)
    res.status(401).json({
        success: false,
        message: 'Invalid tenantId',
    });

}
});


app.get("/api/agreement/:contractNumber", authentication,async (req, res) => {
    const tenantId = req.headers["tenantid"];
    console.log(tenantId,'TenantId'); 
    console.log(req.params.contractNumber,'contract',req.params);
try{
    const indexName = getIndexName(tenantId)
    console.log(indexName,'-indexName')
  
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
    console.log(searchResults,'--searchResult')
    const searchData = await Promise.all(searchResults.hits.hits.map(async record => {
        console.log(record,'--record')
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
    console.log(tenantId,'TenantId');
    console.log(req.body,' value ')
    console.log(req.body.contractInfo.contractNumber)
    const agreementData = {'id':req.body.contractInfo.id,'contractNumber': req.body.contractInfo.contractNumber,'userId':tenantId}
    console.log(agreementData,'----------data---------')
try{
    let agreementDetails
    if(!req.body.contractInfo.id){
        agreementDetails = await dbInstances[tenantId].Agreement.create(agreementData)
        console.log(agreementDetails)
    }
    const indexName = getIndexName(tenantId)
    console.log(indexName,'-indexName')
    console.log(agreementDetails,'agreement Details',agreementDetails.id,agreementDetails.contractNumber)
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
    console.log(tenantId,'Tenant Id');

    try {
        const user = await dbInstances[tenantId].User.findOne({
            where: {
                email: username,
                password: password
            },
        });
        console.log(user)
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
