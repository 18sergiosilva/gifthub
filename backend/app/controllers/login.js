const db = require("../models");
const Usuario = db.usuario;

exports.Usuario = Usuario;

// Login de usuario
function buscarUsuario(req, res) {
    const userOMail = req.body.userOMail;
    const pass = req.body.pass;

    return Usuario.findOne({ $or: [{ username: userOMail }, { correo: userOMail }] })
        .then((data) => {
            if (!data) {
                return res
                    .status(404)
                    .send({ message: `Usuario ${userOMail} no encontrado.` });
            }
            if (data.contrasena != pass) {
                return res
                    .status(400)
                    .send({ message: "Contraseña incorrecta." });
            }
            return res
                .status(200)
                .send({ message: "Login exitoso.", usuario: data });
        })
        .catch(err => {
            return res
                .status(500)
                .send({ message: `Error al buscar el usuario ${userOMail}.` });
        });
}
exports.buscarUsuario = buscarUsuario;

exports.findOne = (req, res) => {
    return buscarUsuario(req, res)
};