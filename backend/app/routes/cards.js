module.exports = app => {
    const producto = require("../controllers/cards");

    var router = require("express").Router();

    // Actualiza las giftcardas
    router.get("/", producto.getAll);

    // La ruta de la api para actualiizar giftcards
    app.use("/cards", router);
};