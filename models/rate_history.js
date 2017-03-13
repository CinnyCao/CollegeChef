module.exports = function (connection, Schema, autoIncrement) {
    var RateHistorySchema = new Schema({
        recipeId: {type: Schema.ObjectId, required: true, ref: "Recipe"},
        personId: {type: Schema.ObjectId, required: true, ref: "User"},
        scores: {type: Number, required: true, min: 1, max: 5}
    });
    
    RateHistorySchema.plugin(autoIncrement.plugin, {model: 'RateHistory', field: 'id'});

    return connection.model('RateHistory', RateHistorySchema);
}
