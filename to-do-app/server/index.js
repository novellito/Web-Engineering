const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');
const items = require('./routes/items');
const ItemsModel = require("./models/item");

const app = express();
const port = 3001;

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost:27017/toDoApp", {
}, err => {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected");
    }
});

// Seed the database with the items list
mongoose.connection.collection('items').count(function(err, count) {
    if( count === 0) {
        console.log("No Found Records. Creating new items list!");

        let item = new ItemsModel({});
        item.save().then((res)=>{
            console.log(res)
            console.log('save successful!')
        },(e)=> {
            console.log('saving error!');
        })
    }
    else {
        console.log("DB already seeded!");
    }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/api', items);

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Acc' +
            'ess-Control-Request-Method, Access-Control-Request-Headers');
    //and remove cacheing so we get the most recent comments
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

// Index Route
app.get('/', (req, res) => {
    console.log('huh')
    res.send('Invalid Endpoint');
});

app.listen(port, () => console.log(`Server started on port ${port}`));