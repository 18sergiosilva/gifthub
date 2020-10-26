module.exports = mongoose => {
    var schema = mongoose.Schema({
        Card:[],
        Value:[],
        TasaCambio:[]
    }, { timestamps: true });

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const CardsValueTasaCambio = mongoose.model("cardsValueTasaCambio", schema);
    return CardsValueTasaCambio;
};