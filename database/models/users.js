module.exports = function (connection, Schema, autoIncrement) {
    var UserSchema = new Schema({
        userName: {type: String, required: true, unique: true},
        email: String,
        // password is sha1 encoded result of userName + password
        password: {type: String, required: true},
        isAdmin: {type: Boolean, default: false},
        description: String,
        profilePhoto: String
    });

    UserSchema.plugin(autoIncrement.plugin, {model: 'User', field: 'id'});

    UserSchema.methods.introduce = function () {
        var greeting = "I am " + this.userName + ". " + (this.isAdmin ? "I am an Admin" : "I am a normal User");
        console.log(greeting);
    };

    return connection.model('User', UserSchema);
};
