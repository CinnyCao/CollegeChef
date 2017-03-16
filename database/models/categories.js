module.exports = function (connection, Schema, autoIncrement) {
    var CategorySchema = new Schema({
        name: {type: String, required: true, unique: true}
    });

    CategorySchema.plugin(autoIncrement.plugin, {model: 'Category', field: 'id'});

    CategorySchema.methods.check = function () {
        var greeting = "Category #" + this.id + " " + this.name;
        console.log(greeting);
    };
    
    return connection.model('Category', CategorySchema);
};
