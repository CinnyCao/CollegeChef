var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsersSchema = new Schema({
    id: {type: Number, required: true},
    userName: {type: String, required: true, unique: true},
    email: String,
    password: {type: String, required: true},
    isAdmin: {type: Boolean, default: false},
    description: String,
    profilePhoto: String
});

module.exports = mongoose.model('Users', UsersSchema);