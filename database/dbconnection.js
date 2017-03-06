// var MongoClient = require('mongodb').MongoClient;
//
// var _db;
//
// module.exports = {
//
//     connectToServer: function(callback) {
//         MongoClient.connect('mongodb://localhost:27017/database', function(err, db) {
//             _db = db;
//             return callback(err);
//         });
//     },
//
//     getDB: function() {
//         return _db;
//     }
//
// };

var mongoose = require('mongoose');

var _db;

module.exports = {

    connectToServer: function(callback) {
        console.log('connect to db');
        mongoose.connect('mongodb://localhost:27017/database', function(err, db) {
            _db = db;
            return callback(err);
        });
    },

    getDB: function() {
        return _db;
    }

};