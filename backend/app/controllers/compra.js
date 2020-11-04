const db = require("../models");
const cards = require('../controllers/cards')
const Usuario = require('../controllers/usuario');
const Transaccion = db.transacciones;

exports.cards = cards;

async function obtenerGiftcards(tarjetas) {
    let giftData = [];
    var giftRequest = {
        send: (data) => {
            giftData = data;
        }
    };

    giftRequest.status = () => { return giftRequest }

    await cards.obtenerDatos(giftRequest)

    if (giftData.message == `Error de la base de datos al devolver las giftcards.`) {
        return { message: `Error de la base de datos al devolver las giftcards.` };
    }

    let tarjetasGift = []
    for (let i = 0; i < tarjetas.length; i++) {
        let giftcard = tarjetas[i]
        for (let j = 0; j < giftData.cards[0].Card.length; j++) {
            let gift = giftData.cards[0].Card[j]
            if (gift.id == giftcard.idTarjeta) {
                let newGiftCard = gift
                newGiftCard.cantidad = parseInt(giftcard.cantidad)
                tarjetasGift.push(newGiftCard)
                break;
            }
        }
    }

    return { tarjetasGift: tarjetasGift, giftData: giftData }
}
exports.obtenerGiftcards = obtenerGiftcards

async function buscarUsuario(username) {
    let userData = [];
    var requestUsuario = {
        send: (data) => {
            userData = data;
        }
    };

    requestUsuario.status = () => { return requestUsuario }

    await Usuario.buscarUsuario({ params: { username: username } }, requestUsuario)

    if (userData.message == `Usuario con username=${username} no encontrado.` ||
        userData.message == `Error al devolver el usuario con username=${username}`) {
        return { message: `Usuario con username=${username} no encontrado.` };
    }

    return userData
}
exports.buscarUsuario = buscarUsuario

async function realizarTransaccion(tarjetasCredito, userData, tarjetaUsuario, monto, tarjetasGift, username, tarjetaCompra) {
    
    var actualizarUsuario = {
        send: (data) => {
        }
    };

    actualizarUsuario.status = () => { return actualizarUsuario }

    let existeTarjeta = true

    for (let i = 0; i < tarjetasCredito.length; i++) {
        let tarjeta = tarjetasCredito[i];
        if (tarjeta.numero == tarjetaUsuario.numero) {
            existeTarjeta = false;
            if (tarjeta.nombre != tarjetaUsuario.nombre ||
                tarjeta.fecha != tarjetaUsuario.fecha ||
                tarjeta.codigoSeguridad != tarjetaUsuario.codigoSeguridad) {
                tarjetaUsuario.transaccion = "Transaccion fallida, tarjeta invalida."
                tarjetaUsuario.totalApagar = monto;
                tarjetaUsuario.tarjetas = tarjetasGift
                let transacciones = []
                for(let k=0;k<tarjetasGift.length;k++){
                    let transaccion = {
                        id: tarjetasGift[i].name,
                        cantidad: tarjetaCompra[i].cantidad,
                        availability: tarjetaCompra[i].availability
                    }
                    transacciones.push(transaccion)
                }
                userData.usuario.transacciones.push(tarjetaUsuario);
                guardarEnHistorial(transacciones,username,"Transaccion fallida, tarjeta invalida.","fallido")
                await Usuario.actualizarUsuario({
                    params: { username: username }, body: {
                        transacciones: userData.usuario.transacciones
                    }
                }, actualizarUsuario)

                return { message: `Los datos de la tarjeta no coinciden.` };
            }
            else {
                tarjeta.credito -= monto;
                if (tarjeta.credito < 0) {
                    tarjetaUsuario.transaccion = "Transaccion fallida debido a la falta de fondos."
                    tarjetaUsuario.totalApagar = monto;
                    tarjetaUsuario.tarjetas = tarjetasGift
                    userData.usuario.transacciones.push(tarjetaUsuario);
                    let transacciones = []
                    for(let k=0;k<tarjetasGift.length;k++){
                        let transaccion = {
                            id: tarjetasGift[i].name,
                            cantidad: tarjetaCompra[i].cantidad,
                            availability: tarjetaCompra[i].availability
                        }
                        transacciones.push(transaccion)
                    }
                    guardarEnHistorial(transacciones,username,"Transaccion fallida debido a la falta de fondos.","fallido")
                    await Usuario.actualizarUsuario({
                        params: { username: username }, body: {
                            transacciones: userData.usuario.transacciones
                        }
                    }, actualizarUsuario)

                    return { message: `Imposible realizar la transaccion, fondos insuficientes` };
                }

            }
        }
    }

    if (existeTarjeta) {
        tarjetaUsuario.credito = 10000 - monto;
        tarjetasCredito.push(tarjetaUsuario);
    }

    return userData
}
exports.realizarTransaccion = realizarTransaccion

function realizarTransaccion2(tarjetas, tarjetaUsuario, card, usuario, tarjetasGift, monto) {
    var gifcardsNews = []
    for (let i = 0; i < tarjetas.length; i++) {
        let giftcard = tarjetas[i]
        for (let j = 0; j < usuario.tarjetas.length; j++) {
            let tarjeta = usuario.tarjetas[j]
            if (tarjeta.id == giftcard.idTarjeta && tarjeta.availability == giftcard.availability) {

                tarjeta.cantidad += parseInt(giftcard.cantidad);
                break;
            }
        }
            let encontroGiftcard = true
            for (let j = 0; j < card.length; j++) {
                let gift = card[j]
                if (gift.id == giftcard.idTarjeta) {

                    for (let k = 0; k < gift.cantidad; k++) {

                        encontroGiftcard = false
                        let newGiftCard = {}

                        newGiftCard.active = gift.active
                        newGiftCard.chargeRate = gift.chargeRate
                        newGiftCard.id = gift.id
                        newGiftCard.image = gift.image
                        newGiftCard.name = gift.name
                        newGiftCard.availability = giftcard.availability
                        newGiftCard.alfanumerico = generarAlfanumerico();

                        gifcardsNews.push(newGiftCard)
                    }
                    break;
                }
            }
            if (encontroGiftcard) {
                tarjetaUsuario.transaccion = "Transaccion fallida, giftcard no encontrada ."
                tarjetaUsuario.totalApagar = monto;
                tarjetasGift.forEach(trjg => {
                    trjg.alfanumerico = 'XXXXXXXX'
                });
                tarjetaUsuario.tarjetas = tarjetasGift

                usuario.transacciones.push(tarjetaUsuario);

                return { message: `Giftcard con id ${giftcard.idTarjeta} no encontrada` };
            }
        
    }

    
    let transacciones = []
    for(let i=0;i<gifcardsNews.length;i++){
        let transaccion = {
            id: gifcardsNews[i].name,
            cantidad: 1,
            availability: gifcardsNews[i].availability
        }
        transacciones.push(transaccion)
    }
    guardarEnHistorial(transacciones,usuario.username,"Transaccion realizada con exito","aceptada")
    tarjetaUsuario.transaccion = "Transaccion realizada con exito."
    tarjetaUsuario.totalApagar = monto;
    
    tarjetaUsuario.tarjetas = gifcardsNews
    usuario.transacciones.push(tarjetaUsuario);

    gifcardsNews.forEach(nGif => {
        usuario.tarjetas.push(nGif);
    });
    return usuario
}
exports.realizarTransaccion2 = realizarTransaccion2

async function actualizarUsusarios(usuario, username) {
    let actualizarData = [];
    var actualizarUsuario = {
        send: (data) => {
            actualizarData = data;
        }
    };

    actualizarUsuario.status = () => { return actualizarUsuario }

    await Usuario.actualizarUsuario({
        params: { username: username }, body: {
            tarjetasCredito: usuario.tarjetasCredito, transacciones: usuario.transacciones, tarjetas: usuario.tarjetas
        }
    }, actualizarUsuario)

    if (actualizarData.message == `¡No se encontro el usuario!`) {
        return { message: `Error al actualizar el usuario con username=${username}.` };
    }
    return { message: `Compra exitosa.` };
}
exports.actualizarUsusarios = actualizarUsusarios

exports.pago = async (req, res) => {
    if (!req.body.tarjetas || !req.body.tarjeta ||
        !req.body.monto || !req.body.username) {
        return res
            .status(400)
            .send({ message: "Datos incompletos." });
    }
    let tarjetaUsuario = req.body.tarjeta;
    tarjetaUsuario.numeroEncriptado = encriptar(tarjetaUsuario.numero)

    let giftData = await exports.obtenerGiftcards(req.body.tarjetas);
    if (giftData.message) {
        res
            .status(404)
            .send({ message: giftData.message });
        return undefined
    }
    let tarjetasGift = giftData.tarjetasGift;
    giftData = giftData.giftData;

    let userData = await buscarUsuario(req.body.username)
    if (userData.message != 'Usuario encontrado.') {
        return res
            .status(404)
            .send({ message: userData.message });
    }

    userData = await exports.realizarTransaccion(userData.usuario.tarjetasCredito, userData,
        tarjetaUsuario, req.body.monto, tarjetasGift, req.body.username, req.body.tarjetas)
    if (userData.message != 'Usuario encontrado.') {
        return res
            .status(404)
            .send({ message: userData.message });
    }

    let usuario = exports.realizarTransaccion2(req.body.tarjetas, tarjetaUsuario, giftData.cards[0].Card, userData.usuario, tarjetasGift, req.body.monto)
    if (usuario.message) {
        return res
            .status(404)
            .send({ message: usuario.message });
    }

    let retorno = await exports.actualizarUsusarios(usuario, req.body.username)
    if (retorno.message == `¡No se encontro el usuario!`) {
        return res.status(404).send({ message: retorno.message });
    }

    return res.status(200).send({ message: retorno.message });
};

function generarAlfanumerico() {
    var caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHJKMNPQRTUVWXYZ2346789";
    var id = "";
    const val = Math.random();
    for (let i = 0; i < 8; i++) id += caracteres.charAt(Math.floor(val * caracteres.length));
    return id;
}
exports.generarAlfanumerico = generarAlfanumerico;


function encriptar(numero) {
    if (numero.toString().length < 16) {
        return numero.toString()
    }
    let aux1 = numero.toString().substring(0, 4);
    let aux2 = numero.toString().substring(12, 16);

    return aux1 + "XXXXXXXX" + aux2
}
exports.encriptar = encriptar;


async function guardarEnHistorial(tarjetas, username, mensaje, estado) {
    const transaccion = new Transaccion({
        usuario1: username,
        usuario2: "XXX",
        tarjetas: tarjetas,
        estado: estado,
        mensaje: mensaje,
        tipo: "Compra"
    });

    Transaccion.create(transaccion).then(() => { console.log("Creado"); });
}

exports.guardarEnHistorial = guardarEnHistorial