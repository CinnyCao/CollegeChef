module.exports = function (connection, Schema, autoIncrement) {
    var CategorySchema = new Schema({
        name: {type: String, required: true, unique: true}
    });
    
    CategorySchema.plugin(autoIncrement.plugin, {model: 'Category', field: 'id'});

    return connection.model('Category', CategorySchema);
};
