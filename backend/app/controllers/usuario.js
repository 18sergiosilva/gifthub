const db = require("../models");
const Usuario = db.usuario;

// Crear y guardar un usuario
exports.crear = (req, res) => {
    // Verifica si los parametros existen
    if (!req.body.username || !req.body.correo || !req.body.contrasena ||
        !req.body.nombres || !req.body.apellidos || !req.body.dpi ||
        !req.body.edad) {
        return res.status(400).json({ message: "Los datos enviados de usuario son incorrectos." });
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

    // Guardar usuario en la base de datos
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

// Actualizar un usuario encontrado con su username
exports.actualizar = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Los datos a modificar no deben de esta vacios."
        });
    }

    let username = req.params.username;

    Usuario.findOneAndUpdate({ username: username }, req.body)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `¡No se encontro el usuario!`
                });
            } else res.send({ message: "Usuario actualizado correctamente." });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message: `Error al actualizar el usuario con username=${username}.`
            });
        });
};