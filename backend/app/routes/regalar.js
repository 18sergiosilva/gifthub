module.exports = app => {
    const regalr = require("../controllers/reglar");

    var router = require("express").Router();

    // Actualiza las giftcardas
    router.post("/", regalr.regalar);
    router.get("/", regalr.transacciones);

    // La ruta de la api para actualiizar giftcards
    app.use("/regalar", router);
};