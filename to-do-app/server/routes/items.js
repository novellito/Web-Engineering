const express = require('express');
const router = express.Router();
const ItemsModel = require("../models/item");

//List all items
router.get('/item', (req, res, next) => {
 
    let item = ItemsModel.findOne({});

    item.then((data) => {
        res.json({items:data.items});
    },(e)=> {
        res.json({msg:'error!'});
    })
});

//Add new item
router.post('/item', (req, res, next) => {

    console.log(req.body);
    let item = ItemsModel.findOne({});
 
    item.then((data)=>{

        console.log('Updating list!');
        data.items.push(req.body.item);
        data.save();
        res.json({msg:'success!'});
        
    },(e)=> {
        console.log('saving error!');
        res.json({msg:'error!'});
    });
});


module.exports = router;