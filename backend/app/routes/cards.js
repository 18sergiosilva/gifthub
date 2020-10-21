module.exports = app => {
    const producto = require("../controllers/cards");

    var router = require("express").Router();

    // Actualiza las giftcardas
    router.get("/", producto.actualizar);

    // Obtener las giftcarg
    router.get("/mongo", producto.getAll);

    // La ruta de la api para actualiizar giftcards
    app.use("/cards", router);
};