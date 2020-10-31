module.exports = mongoose => {
    var schema = mongoose.Schema({
        usuario1:  { type: String, required: true},
        usuario2:  { type: String, required: true},
        tarjetas: [],
        estado:  { type: String, required: true},
        mensaje:  { type: String, required: true}
    }, { timestamps: true });

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Transacciones = mongoose.model("transacciones", schema);
    return Transacciones;
};