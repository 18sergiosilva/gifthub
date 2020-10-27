module.exports = app => {
    const compra = require("../controllers/compra");

    var router = require("express").Router();

    // Actualiza las giftcardas
    router.post("/", compra.comprar);

    // Actualiza las giftcardas
    router.post("/pago", compra.pago);
    
    // La ruta de la api para actualiizar giftcards
    app.use("/compra", router);
};