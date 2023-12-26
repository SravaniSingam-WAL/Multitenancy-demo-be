const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { dbInstances } = require("./models");
const { authentication } = require("./middleware/authentication");
app.use(express.json());
app.use(cors());


app.get("/", async (req, res) => {
    console.log("Hello world");
    res.json("hello world");
});

app.get("/api/agreement", authentication,async (req, res) => {
    const tenantId = req.headers["tenantid"];
    console.log(tenantId);
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
});
