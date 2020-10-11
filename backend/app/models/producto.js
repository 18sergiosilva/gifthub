/*
module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      nombre: { type: String, required: true },
      vendedor: { type: String, required: true },
      precio: { type: Number, required: true },
      descripcion: String,
      tags: []
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Producto = mongoose.model("producto", schema);
  return Producto;
};
*/