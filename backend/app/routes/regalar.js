module.exports = app => {
    const regalr = require("../controllers/reglar");

    var router = require("express").Router();

    // Actualiza las giftcardas
    router.post("/", regalr.regalar);

    // La ruta de la api para actualiizar giftcards
    app.use("/regalar", router);
};