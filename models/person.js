/**
 * Created by xiangry on 2016/12/7.
 */
var mongoose = require('mongoose')

var PersonSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    gender: Number, //0：男 1：女
    age: Number,
    mobile: String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});
var Person = mongoose.model('Person', PersonSchema);

module.exports = Person;
