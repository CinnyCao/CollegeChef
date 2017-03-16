module.exports = function (connection, Schema, autoIncrement) {
    var RateSchema = new Schema({
        recipeId: {type: Number, required: true, ref: 'Recipe'},
        personId: {type: Number, required: true, ref: 'User'},
        scores: {type: Number, required: true, min: 1, max: 5}
    });
    
    RateSchema.plugin(autoIncrement.plugin, 'Rate');

    return connection.model('Rate', RateSchema);
};
