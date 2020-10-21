const db = require("../models");
const Usuario = db.usuario;

exports.Usuario = Usuario;

// Crear y guardar un usuario
exports.create = (req, res) => {
    // Verifica si los parametros existen
    if (!req.body.username || !req.body.correo || !req.body.contrasena ||
        !req.body.nombres || !req.body.apellidos || !req.body.dpi ||
        !req.body.edad) {
        return res.status(400).send({
            message: "Los datos enviados de usuario son incorrectos."
        });
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
    Usuario.create(usuario)
        .then(() => {
            return res.status(200).send({
                message: "El usuario se creo correctamente."
            });
        })
        .catch(err => {
            return res.status(500).send({
                message: "Error al crear el Usuario."
            });
        });
};

// Actualizar un usuario encontrado con su username
exports.actualizar = (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).send({
            message: "Los datos a modificar no deben de esta vacios."
        });
    }

    let username = req.params.username;

    Usuario.findOneAndUpdate({ username: username }, req.body)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: `¡No se encontro el usuario!`
                });
            } else {
                return res.status(200).send({ message: "Usuario actualizado correctamente." });
            }
        })
        .catch(err => {
            return res.status(500).send({
                message: `Error al actualizar el usuario con username=${username}.`
            });
        });
};


// Busca usuario por su username
exports.findOne = (req, res) => {
    const username = req.params.username;

    Usuario.findOne({ username: username })
        .then((data) => {
            if (!data) {
                return res
                    .status(404)
                    .send({ message: `Usuario con username=${username} no encontrado.` });
            }
            return res
                .status(200)
                .send({ message: "Usuario encontrado.", usuario: data });

        })
        .catch(err => {
            return res
                .status(500)
                .send({ message: `Error al devolver el usuario con username=${username}` });
        });
};

// Elimina un usuario por su username
exports.delete = (req, res) => {
    const username = req.params.username;

    Usuario.findOneAndRemove({ username: username })
        .then(data => {
            if (!data) {
                return res.status(404).send({
                    message: `El Usuario ${username} no existe.`
                });
            }
            return res.status(200).send({
                message: `Usuario Eliminado`
            });
        })
        .catch(() => {
            return res.status(500).send({
                message: `Error al eliminar el usuario ${username}`
            });
        });
};