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
    let actualizarData = [];
    var actualizarUsuario = {
        send: (data) => {
            actualizarData = data;
        }
    };

    actualizarUsuario.status = () => { return actualizarUsuario }
    //---
    let tarjetaUsuario = req.body.tarjeta;
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
    let tarjetasGift = []
    for (let i = 0; i < req.body.tarjetas.length; i++) {
        giftcard = req.body.tarjetas[i]
        for (let j = 0; j < giftData.cards.Card.length; j++) {
            gift = giftData.cards.Card[j]
            if (gift.id == giftcard.idTarjeta) {
                let newGiftCard = gift
                newGiftCard.cantidad = parseInt(giftcard.cantidad)

                tarjetasGift.push(newGiftCard)
                break;
            }
        };
    };

    //---
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

    let existeTarjeta = true

    for (let i = 0; i < userData.usuario.tarjetasCredito.length; i++) {
        tarjeta = userData.usuario.tarjetasCredito[i];
        if (tarjeta.numero == tarjetaUsuario.numero) {
            existeTarjeta = false;
            if (tarjeta.nombre != tarjetaUsuario.nombre ||
                tarjeta.fecha != tarjetaUsuario.fecha ||
                tarjeta.codigoSeguridad != tarjetaUsuario.codigoSeguridad) {
                tarjetaUsuario.transaccion = "Transaccion fallida tarjeta invalida."
                tarjetaUsuario.totalApagar = req.body.monto;
                tarjetaUsuario.tarjetas = tarjetasGift
                userData.usuario.transacciones.push(tarjetaUsuario);
                await Usuario.actualizarUsuario({
                    params: { username: req.body.username }, body: {
                        transacciones: userData.usuario.transacciones
                    }
                }, actualizarUsuario)

                return res
                    .status(404)
                    .send({ message: `Los datos de la tarjeta no coinciden.` });
            }
            else {
                tarjeta.credito -= req.body.monto;
                if (tarjeta.credito < 0) {
                    tarjetaUsuario.transaccion = "Transaccion fallida debido a la falta de fondos."
                    tarjetaUsuario.totalApagar = req.body.monto;
                    tarjetaUsuario.tarjetas = tarjetasGift
                    userData.usuario.transacciones.push(tarjetaUsuario);
                    await Usuario.actualizarUsuario({
                        params: { username: req.body.username }, body: {
                            transacciones: userData.usuario.transacciones
                        }
                    }, actualizarUsuario)

                    return res
                        .status(404)
                        .send({ message: `Imposible realizar la transaccion, fondos insuficientes` });
                }

            }
        }
    };

    if (existeTarjeta) {
        tarjetaUsuario.credito = 10000 - req.body.monto;
        userData.usuario.tarjetasCredito.push(tarjetaUsuario);
    }


    for (let i = 0; i < req.body.tarjetas.length; i++) {
        giftcard = req.body.tarjetas[i]
        let existeGift = true;
        for (let j = 0; j < userData.usuario.tarjetas.length; j++) {
            tarjeta = userData.usuario.tarjetas[j]
            if (tarjeta.id == giftcard.idTarjeta) {
                existeGift = false;
                tarjeta.cantidad += parseInt(giftcard.cantidad);
                break;
            }
        };
        if (existeGift) {
            let encontroGiftcard = true
            for (let j = 0; j < giftData.cards.Card.length; j++) {
                gift = giftData.cards.Card[j]
                if (gift.id == giftcard.idTarjeta) {
                    encontroGiftcard = false
                    let newGiftCard = gift
                    newGiftCard.cantidad = parseInt(giftcard.cantidad)

                    userData.usuario.tarjetas.push(newGiftCard)
                    break;
                }
            };
            if (encontroGiftcard) {
                tarjetaUsuario.transaccion = "Transaccion fallida, giftcard no encontrada ."
                tarjetaUsuario.totalApagar = req.body.monto;
                tarjetaUsuario.tarjetas = tarjetasGift
                userData.usuario.transacciones.push(tarjetaUsuario);

                return res
                    .status(404)
                    .send({ message: `Giftcard con id ${tarjeta.id} no encontrada` });
            }
        }
    };

    tarjetaUsuario.transaccion = "Transaccion realizada con exito."
    tarjetaUsuario.totalApagar = req.body.monto;
    tarjetaUsuario.tarjetas = tarjetasGift
    userData.usuario.transacciones.push(tarjetaUsuario);

    await Usuario.actualizarUsuario({
        params: { username: req.body.username }, body: {
            tarjetasCredito: userData.usuario.tarjetasCredito, transacciones: userData.usuario.transacciones, tarjetas: userData.usuario.tarjetas
        }
    }, actualizarUsuario)

    if (actualizarData.message == `¡No se encontro el usuario!`) {
        return res
            .status(404)
            .send({ message: `Error al actualizar el usuario con username=${req.body.username}.` });
    }

    return res.status(200).send({ message: "se realizo la compra de las giftcards." });
};
