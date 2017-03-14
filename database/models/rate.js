module.exports = function (connection, Schema, autoIncrement) {
    var RateSchema = new Schema({
        recipeId: {type: Schema.ObjectId, required: true, ref: 'Recipe'},
        personId: {type: Schema.ObjectId, required: true, ref: 'User'},
        scores: {type: Number, required: true, min: 1, max: 5}
    });
    
    RateSchema.plugin(autoIncrement.plugin, {model: 'Rate', field: 'id'});

    return connection.model('Rate', RateSchema);
};
