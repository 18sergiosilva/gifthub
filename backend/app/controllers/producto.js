/*const db = require("../models");
const Producto = db.producto;

exports.Producto = Producto;

// Crear y guardar un producto
exports.create = (req, res) => {

    if (!req.body.nombre || !req.body.vendedor || !req.body.precio) {
        return res.status(400).json({ message: "Los datos enviados del producto son incorrectos" });
    }

    Producto.create({
            nombre: req.body.nombre,
            vendedor: req.body.vendedor,
            precio: req.body.precio,
            descripcion: req.body.descripcion || "No categorizado",
            tags: req.body.tags || []
        },
        // callback
        (err, product) => {
            if (err) {
                return res.status(500).json({
                    db_message: err.message || "",
                    message: "Error al agregar producto"
                });
            }
            return res.status(201).json({
                producto: product,
                message: "Creado"
            });
        });
};

// Obtener un producto con su codigo
exports.findOne = (req, res) => {
    const codigo = req.params.codigo;

    if (codigo.length != 24 && codigo.length != 12) {
        return res.status(400).send({
            message: "Codigo invalido"
        });
    }

    Producto.findOne({ _id: codigo }, function(err, data) {
        if (err) {
            return res.status(500).json({
                message: "Error al obtener el producto",
                db_message: err.message || ""
            });
        }
        if (!data) {
            return res.status(404).json({
                message: `El producto ${codigo} no existe`
            });
        }

        return res.json(data);
    });
};

// Modificar un producto por su codigo
exports.update = (req, res) => {
    if (!req.body.nombre && !req.body.vendedor && !req.body.descripcion && !req.body.tags && !req.body.precio) {
        return res.status(400).send({
            message: "No se enviaron datos a modificar"
        });
    }

    const codigo = req.params.codigo;

    if (codigo.length != 24 && codigo.length != 12) {
        return res.status(400).send({
            message: "Codigo invalido"
        });
    }

    Producto.findOneAndUpdate({ _id: codigo }, req.body, { useFindAndModify: false, new: true })
        .then(data => {
            if (!data) {
                return res.status(404).json({
                    message: `El producto ${codigo} no existe`
                });
            }

            return res.json({
                message: 'Modificado',
                producto: data
            });
        })
        .catch(err => {
            res.status(500).json({
                message: `Error modificando el producto ${codigo}`,
                db_message: err.message || ""
            });
        });
};

// Elimina un producto por su codigo
exports.delete = (req, res) => {
    const codigo = req.params.codigo;

    if (codigo.length != 24 && codigo.length != 12) {
        return res.status(400).send({
            message: "Codigo invalido"
        });
    }

    Producto.findOneAndRemove({ _id: codigo })
        .then(data => {
            if (!data) {
                return res.status(404).send({
                    message: `El producto ${codigo} no existe.`
                });
            }

            return res.send({
                message: `Eliminado`
            });
        })
        .catch(err => {
            return res.status(500).json({
                message: `Error al eliminar el producto ${codigo}`,
                db_message: err.message || ""
            });
        });
};

// Obtener todos los productos
exports.getAll = (_req, res) => {
    Producto.find({})
        .then(data => {
            return res.json(data);
        })
        .catch(err => {
            return res.status(500).json({
                message: "Error al retornar todos los productos en la BD",
                db_message: err.message || ""
            });
        });
};

// Buscar producto
exports.find = (req, res) => {
    if (req.query.search == undefined) {
        return res.status(400).send({
            message: "La busqueda no puede estar vacia"
        });
    }
    const consulta = req.query.search.replace(/ /g, "|")
        .replace(/,/g, "");

    if (!consulta) {
        return res.status(400).send({
            message: "La busqueda no puede estar vacia"
        });
    }
    Producto.find({
            $or: [{
                nombre: {
                    $regex: consulta,
                    $options: "i"
                }
            }, {
                vendedor: {
                    $regex: consulta,
                    $options: "i"
                }
            }, {
                descripcion: {
                    $regex: consulta,
                    $options: "i"
                }
            }]
        })
        .then(data => {
            if (data.length == 0) {
                return res.status(404).json({
                    message: `No se encontraron productos con la ` +
                        `busqueda "${consulta}"`
                });
            }
            return res.json(data);
        })
        .catch(err => {
            return res.status(500).json({
                message: "Error al retornar una lista de productos de la BD"
            });
        });
};
*/