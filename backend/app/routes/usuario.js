module.exports = app => {
    
    const usuario = require("../controllers/usuario");

    var router = require("express").Router();

    // Crear un nuevo usuario
    router.post("/", usuario.crear);

    // La ruta de la api de usuarios sera url/usuarios
    app.use("/usuario", router);
    
};