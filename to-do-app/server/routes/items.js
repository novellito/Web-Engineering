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
        res.json({msg:'success!', data:data.items});
        
    },(e)=> {
        console.log('saving error!');
        res.json({msg:'error!'});
    });
});

//update an item
router.put('/item', (req, res, next) => {

    console.log(req.body);
    let item = ItemsModel.findOne({});
 
    item.then((data)=>{

        const index = data.items.indexOf(req.body.currItem);

        if(index > -1) {
            data.items.splice(index,1,req.body.itemToUpdate);
            data.save();
        }

        res.json({msg:'success!', data:data.items});
        
    },(e)=> {
        console.log('saving error!');
        res.json({msg:'error!'});
    });
});

//delete an item
router.delete('/item', (req, res, next) => {

    let item = ItemsModel.findOne({});
 
    item.then((data) => {

        const index = data.items.indexOf(req.body.elem);

        if(index > -1) {
            data.items.splice(index,1);
            data.save();
        }

        res.json({msg:'success!', data:data.items});
        
    },(e)=> {
        console.log('saving error!');
        res.json({msg:'error!'});
    });
});


module.exports = router;