const db = require("../models");
const axios = require('axios');
const cards = require('../controllers/cards')
const Usuario = require('../controllers/usuario')
const CardsValueTasaCambio = db.cardsValueTasaCambio;

// Actualiiza las giftcards en la base de datos
exports.comprar = async (req, res) => {
    let reportData = [];
    var request = {
        send: (data) => {
            reportData = data;
        }
    };

    tarjetas = req.body.tarjetas

    request.status = () => { return request }

    await cards.obtenerDatos(request)

    let total = 0;
    reportData.cards.Value.forEach((tarjeta) => {
        tarjetas.forEach((giftcard) => {
            if (tarjeta.id == giftcard.idTarjeta) {
                total += tarjeta.total * giftcard.cantidad
            }
        })
    })
    console.log(reportData.cards.Value)

    return res.status(200).send(reportData);
};

exports.pago = async (req, res) => {
    let userData = [];
    var requestUsuario = {
        send: (data) => {
            userData = data;
        }
    };

    requestUsuario.status = () => { return requestUsuario }

    await Usuario.buscarUsuario({ params: { username: req.body.username } }, requestUsuario)

    if (userData.message == `Usuario con username=${req.body.username} no encontrado.` ||
        userData.message == `Error al devolver el usuario con username=${req.body.username}`) {
        return res
            .status(404)
            .send({ message: `Usuario con username=${req.body.username} no encontrado.` });
    }

    let tarjetaUsuario = req.body.tarjeta;

    let existeTarjeta = true
    userData.usuario.tarjetasCredito.forEach((tarjeta) => {
        if (tarjeta.numeroTarjeta == tarjetaUsuario.numero) {
            existeTarjeta = false;
            if (tarjeta.nombre != tarjetaUsuario.nombre ||
                tarjeta.fecha != tarjetaUsuario.fecha ||
                tarjeta.codigoSeguridad != tarjetaUsuario.codigoSeguridad) {
                return res
                    .status(404)
                    .send({ message: `Los datos de la tarjeta no coinciden.` });
            }
            else {
                tarjeta.credito -= req.body.monto;
            }
        }
    });

    if (existeTarjeta) {
        tarjetaUsuario.credito = 10000 - req.body.monto;
        userData.usuario.tarjetasCredito.push(tarjetaUsuario);
    }

    //------------
    let giftData = [];
    var giftRequest = {
        send: (data) => {
            giftData = data;
        }
    };

    giftRequest.status = () => { return giftRequest }

    await cards.obtenerDatos(giftRequest)

    if (giftData.message == `Error de la base de datos al devolver las giftcards.`) {
        return res
            .status(404)
            .send({ message: `Error de la base de datos al devolver las giftcards.` });
    }

    req.body.tarjetas.forEach((giftcard) => {
        let existeGift = true;
        userData.usuario.tarjetas.forEach((tarjeta) => {
            if (tarjeta.id == giftcard.idTarjeta) {
                existeGift = false;
                tarjeta.cantidad += parseInt(giftcard.cantidad);
                return
            }
        });
        if (existeGift) {
            let encontroGiftcard = true
            giftData.cards.Card.forEach((gift) => {
                if (gift.id == giftcard.idTarjeta) {
                    encontroGiftcard = false
                    let newGiftCard = gift
                    newGiftCard.cantidad = parseInt(giftcard.cantidad)
                    
                    userData.usuario.tarjetas.push(newGiftCard)
                    return
                }
            });
            if (encontroGiftcard) {
                return res
                    .status(404)
                    .send({ message: `Giftcard con id ${tarjeta.id} no encontrada` });
            }
        }
    });

    let actualizarData = [];
    var actualizarUsuario = {
        send: (data) => {
            actualizarData = data;
        }
    };

    actualizarUsuario.status = () => { return actualizarUsuario }

    await Usuario.actualizarUsuario({ params: { username: req.body.username }, body: { tarjetas: userData.usuario.tarjetas } }, actualizarUsuario)

    if (actualizarData.message == `¡No se encontro el usuario!`) {
        return res
            .status(404)
            .send({ message: `Error al actualizar el usuario con username=${req.body.username}.` });
    }



    return res.status(200).send({ message: "se realizo la compra de las giftcards." });
};
