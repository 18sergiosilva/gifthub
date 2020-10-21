const db = require("../models");
const axios = require('axios');
const Card = db.card;

exports.Card = Card;

exports.axios = axios;

// Actualiiza las giftcards en la base de datos
exports.actualizar = (req, res) => {
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

// Obtener todas las giftcards
exports.getAll = (req, res) => {
    Card.find({})
        .then((data) => {
            return res
                .status(200)
                .send({ message: "Se devolvieron las giftcards.", cards: data });

        })
        .catch(err => {
            return res
                .status(500)
                .send({ message: `Error de la base de datos al devolver las giftcards` });
        });
};