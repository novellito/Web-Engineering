const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
    items: []
});

const Item = module.exports = mongoose.model('Item', ItemSchema);