const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8001;
const app = express();
const { v4: uuidv4 } = require('uuid');
const { createAccount, compareCredentials, checkIfAccountExist } = require('./model/accountdb')
app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));
app.use(cors({ origin: '*' }));
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const gamesRouter = require('./routes/gamesRouter')
app.use('/api/games', gamesRouter)

app.post('/api/login', async (req, res) => {
    const credentials = req.body;
    
    const result = await compareCredentials(credentials)
    
    const resObj = {
        success: false
    }
    if (result.length === 1) {

        resObj.success = true
        resObj.message = 'Logged in'
        resObj.key = result[0]

    } else {
        resObj.message = 'Wrong username and/or password'
    }
    res.json(resObj)
})

app.post('/api/signup', async (req, res) => {
    const credentials = req.body;
    const checkIfExist = await checkIfAccountExist(credentials)

    const resObj = {
        success: false
    }

    if (checkIfExist.length > 0) {
        resObj.message = 'Account already exist.'
    } else {
        credentials.accountId = uuidv4();
        const result = await createAccount(credentials)

        if (result) {
            resObj.success = true;
            resObj.message = `Account ${credentials.username} created.`;
            resObj.accountId = credentials.accountId
        }
    }

    res.json(resObj)
});


app.listen(8001, () => {
    console.log(`Server started on port ${PORT}`);
})
