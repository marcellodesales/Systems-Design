// Using redis as key-value store for caching purpose
// Redis - a memory cache 
const database = require('./database.js');
const express = require('express');
const redis = require('redis').createClient();

const app = express();

app.get('/withoutcache/index.html', (req,res) => {
    database.get('index.html',page => {
        res.send(page);
    });
});

app.get('/withcache/index.html', (req, res) => {
    redis.get('index.html', (err, redisRes) => {
        if(redisRes) {
            res.send(redisRes);
            return;
        }
   
        database.get('index.html', page => {
         redis.set('index.html', page, 'EX', 10);
         res.send(page);
        });
    });
});

app.listen(3001, function() {
    console.log('Listening on port 3001!');
});


