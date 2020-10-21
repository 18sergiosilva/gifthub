module.exports = mongoose => {
    var schema = mongoose.Schema({
        id: { type: String, required: true, unique: true },
        name: { type: String, required: true, },
        image: { type: String, required: true },
        chargeRate: { type: Number, required: true },
        active: { type: Boolean, required: true },
        availability: { type: Array, required: true, },
    }, { timestamps: true });

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Card = mongoose.model("card", schema);
    return Card;
};