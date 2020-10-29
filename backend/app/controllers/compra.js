const cards = require('../controllers/cards')
const Usuario = require('../controllers/usuario');

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
        giftcard = tarjetas[i]
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

    return { tarjetasGift: tarjetasGift, giftData: giftData }
}

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

async function realizarTransaccion(tarjetasCredito, userData, tarjetaUsuario, monto, tarjetasGift, username) {
    let actualizarData = [];
    var actualizarUsuario = {
        send: (data) => {
            actualizarData = data;
        }
    };

    actualizarUsuario.status = () => { return actualizarUsuario }

    let existeTarjeta = true

    for (let i = 0; i < tarjetasCredito.length; i++) {
        tarjeta = tarjetasCredito[i];
        if (tarjeta.numero == tarjetaUsuario.numero) {
            existeTarjeta = false;
            if (tarjeta.nombre != tarjetaUsuario.nombre ||
                tarjeta.fecha != tarjetaUsuario.fecha ||
                tarjeta.codigoSeguridad != tarjetaUsuario.codigoSeguridad) {
                tarjetaUsuario.transaccion = "Transaccion fallida tarjeta invalida."
                tarjetaUsuario.totalApagar = monto;
                tarjetaUsuario.tarjetas = tarjetasGift
                userData.usuario.transacciones.push(tarjetaUsuario);
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
                    await Usuario.actualizarUsuario({
                        params: { username: username }, body: {
                            transacciones: userData.usuario.transacciones
                        }
                    }, actualizarUsuario)

                    return { message: `Imposible realizar la transaccion, fondos insuficientes` };
                }

            }
        }
    };

    if (existeTarjeta) {
        tarjetaUsuario.credito = 10000 - monto;
        tarjetasCredito.push(tarjetaUsuario);
    }

    return userData
}

async function realizarTransaccion2(tarjetas, tarjetaUsuario, card, usuario, giftcard, tarjetasGift, monto) {
    for (let i = 0; i < tarjetas.length; i++) {
        giftcard = tarjetas[i]
        let existeGift = true;
        for (let j = 0; j < usuario.tarjetas.length; j++) {
            tarjeta = usuario.tarjetas[j]
            if (tarjeta.id == giftcard.idTarjeta) {
                existeGift = false;
                tarjeta.cantidad += parseInt(giftcard.cantidad);
                break;
            }
        };
        if (existeGift) {
            let encontroGiftcard = true
            for (let j = 0; j < card.length; j++) {
                gift = card[j]
                if (gift.id == giftcard.idTarjeta) {
                    encontroGiftcard = false
                    let newGiftCard = gift
                    newGiftCard.cantidad = parseInt(giftcard.cantidad)

                    usuario.tarjetas.push(newGiftCard)
                    break;
                }
            };
            if (encontroGiftcard) {
                tarjetaUsuario.transaccion = "Transaccion fallida, giftcard no encontrada ."
                tarjetaUsuario.totalApagar = req.body.monto;
                tarjetaUsuario.tarjetas = tarjetasGift
                usuario.transacciones.push(tarjetaUsuario);

                return { message: `Giftcard con id ${tarjeta.id} no encontrada` };
            }
        }
    };

    tarjetaUsuario.transaccion = "Transaccion realizada con exito."
    tarjetaUsuario.totalApagar = monto;
    tarjetaUsuario.tarjetas = tarjetasGift
    usuario.transacciones.push(tarjetaUsuario);

    return usuario
}

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

exports.pago = async (req, res) => {
    if (!req.body.tarjetas || !req.body.tarjeta ||
        !req.body.monto || !req.body.username ||
        req.body.availability) {
        return res
            .status(400)
            .send({ message: "Datos incompletos." });
    }
    let tarjetaUsuario = req.body.tarjeta;

    let giftData = await obtenerGiftcards(req.body.tarjetas);
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

    userData = await realizarTransaccion(userData.usuario.tarjetasCredito, userData,
        tarjetaUsuario, req.body.monto, tarjetasGift, req.body.username)
    if (userData.message != 'Usuario encontrado.') {
        return res
            .status(404)
            .send({ message: userData.message });
    }

    let usuario = await realizarTransaccion2(req.body.tarjetas, tarjetaUsuario, giftData.cards.Card, userData.usuario, giftcard, tarjetasGift, req.body.monto)
    if (usuario.message) {
        return res
            .status(404)
            .send({ message: usuario.message });
    }

    retorno = await actualizarUsusarios(usuario, req.body.username)
    if (retorno.message != `¡No se encontro el usuario!`) {
        return res.status(404).send({ message: retorno.message });
    }

    return res.status(200).send({ message: retorno.message });
};
