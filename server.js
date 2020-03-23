// Require Libraries
const express = require('express');
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;

require('dotenv/config')

// App Setup
const app = express();
let port = process.env.PORT || 3003
let mongoose_url = process.env.MONGODB_URI
const dbName = "articles"

// connect to DB
MongoClient.connect(mongoose_url, {poolSize:10}, async function(err, client) {
    await assert.equal(null, err);
    await console.log("Connected successfully to server");
   
    const db = await client.db(dbName);
    let AllArticlesMap = {}

    await findAllArticlesDB(db).then((docs)=>{
        AllArticlesMap = docs
    }).catch((err) => {
        console.log(err)
    })

    app.get('/', (req,res) => {
        console.log(AllArticlesMap)
        res.status(200).send(JSON.stringify(AllArticlesMap))
    });

    client.close();
});

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}

const findAllArticlesDB = async function(db){
    return new Promise(async(res,rej)=>{
        let mapOfAllArticles = new Map()
        await db.collections().then((docs)=>{
            const start = async () => {
                await asyncForEach(docs, async (doc)=>{
                    let key = doc.s.namespace.collection
    
                    await findAllArticlesColl(db, key).then((articles)=>{
                        val = articles
                        mapOfAllArticles.set(key, val)
                    }).catch((err)=>{
                        mapOfAllArticles.set(key, "No Articles for this date")
                    })
                })
                return res(mapOfAllArticles)
            }
            return start()
        }).catch((err)=>{
            return rej(err)
        })
    })
}

const findAllArticlesColl = async function(db, date){
    return new Promise(async(res, rej) => {
        const coll = db.collection(date);

        coll.find({}).toArray(function(err, docs) {
            assert.equal(err, null);
            // console.log("Found the following records");
            if (docs.length == 0){
                return rej("No Articles for this date")
            } else {
                return res(docs)
            }
        });
    })
}



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


// Start Server
app.listen(port, () => {
    console.log(`Corona-Wiki running on localhost:${port}`);
});