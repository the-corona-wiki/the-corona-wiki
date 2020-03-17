// Require Libraries
const express = require('express');
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
require('dotenv/config')

// App Setup
const app = express();
let port = process.env.PORT || 3003
let mongoose_url = process.env.MONGODB_URI


// Middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});


//Get start
app.get('/', (req,res) => {
    res.status(200).send("Ok, connected to Corona Wiki")
});



// Connect DB
mongoose.connect(mongoose_url, 
    { useNewUrlParser: true },
    () => console.log('Connected to DB')
)

// Start Server
app.listen(port, () => {
    console.log(`Corona-Wiki running on localhost:${port}`);
});