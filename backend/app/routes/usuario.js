module.exports = app => {

    const usuario = require("../controllers/usuario");

    var router = require("express").Router();

    // Crear un nuevo usuario
    router.post("/", usuario.create);

    // Actualiza la informacion del usuario buscado por username
    router.put("/:username", usuario.actualizar);

    // Devuelve la informacion del usuario buscado por username
    router.get("/:username", usuario.findOne);

    // Devuelve todos los usuarios
    router.get("/", usuario.getAll);

    // Elimina un usuario buscado por username
    router.delete("/:username", usuario.delete);

    // La ruta de la api de usuarios sera url/usuarios
    app.use("/usuario", router);

};