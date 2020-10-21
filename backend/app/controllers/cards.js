const db = require("../models");
const axios = require('axios');
const Card = db.card;

exports.axios = axios;


// Actualiiza las giftcards en la base de datos
exports.getAll = (req, res) => {
    Card.deleteMany({}, () => {});
    axios.get('https://my-json-server.typicode.com/CoffeePaw/AyD1API/Card')
        .then(resp => {
            Card.insertMany(resp.data)
                .then(() => {})
            return res
                .status(200)
                .send({ message: "giftcards actualizadas" });
        })
        .catch(err => {
            return res
                .status(500)
                .send({ message: `Error al actualizar las giftcards` });
        });;
};