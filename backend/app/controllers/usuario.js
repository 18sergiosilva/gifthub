const db = require("../models");
const Usuario = db.usuario;

// Crear y guardar un usuario
exports.crear = (req, res) => {
    // Verifica si los parametros existen
    if (!req.body.username || !req.body.correo || !req.body.contrasena ||
        !req.body.nombres || !req.body.apellidos || !req.body.dpi ||
        !req.body.edad) {
        return res.status(400).json({ message: "Los datos enviados de usuario son incorrectos" });
    }

    const usuario = new Usuario({
        username: req.body.username,
        correo: req.body.correo,
        contrasena: req.body.contrasena,
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        dpi: req.body.dpi,
        edad: req.body.edad,
        tarjetas: req.body.tarjetas || [],
        transacciones: req.body.transacciones || []
    });

    // Save usuario in the database
    usuario
        .save(usuario)
        .then(data => {
            res.send({ message: "El usuario se creo correctamente.", data: data });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message: err.message || "Error al crear el Usuario."
            });
        });
};