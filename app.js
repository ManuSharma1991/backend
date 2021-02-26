const express = require('express');
const port = process.env.PORT || 3000
const cors = require('cors')
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const compression = require('compression');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())
app.use(compression())
var distDir = __dirname + "/dist/budget/";
app.use(express.static(distDir));
let test_string = {};

async function getData() {

    const client = await MongoClient.connect('mongodb+srv://manusharma:Manu1991@budget.todio.mongodb.net/budget?authSource=admin&replicaSet=atlas-bn9u8e-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = client.db('cool-budget');
    const result = await db.collection('categories').find({}).toArray();
    test_string = JSON.stringify(result);
    console.log(test_string);
    client.close();
}


getData();



app.get('/api/data', async (req, res) => {
    res.json({
        "message": "Welcome to backend of Budget",
        "db_status": await test_string
    });
});

app.get('/.well-known/pki-validation/EDD5834810BCB299238C0D0A08623548.txt', async (req, res) => {
    res.send(`BC1EDAA9EB730796A521207CB9ADD82BB018125CC1A692979F39269BA24818CD
comodoca.com
10acef73c204f43`);
});


app.listen(port, () => {
    console.log("Server is listening on port" + port);
});
