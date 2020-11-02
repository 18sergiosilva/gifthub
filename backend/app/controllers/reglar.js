const db = require("../models");
const Usuario = db.usuario;
const controllerUsuario = require("../controllers/usuario");
const Transaccion = db.transacciones;

exports.Usuario = Usuario;

async function obtenerUsuario(username) {
    let userData = {}
    let request = {
        send: (data) => {
            userData = data;
        }
    }

    request.status = () => { return request };

    await controllerUsuario.buscarUsuario({ params: { username: username } }, request)

    if (userData.message == `Usuario con username=${username} no encontrado.` ||
        userData.message == `Error al devolver el usuario con username=${username}`) {
        return undefined
    }

    return userData.usuario
}

function modificarInventarioTrjetasUsuario1(usuario, tarjetas) {
    let cards = []
    let cardsUser = []
    let existe;
    for (const t of tarjetas) {
        //console.log("Tarjeta a regalar: ", t);
        existe = false;

        for (let i = 0; i < usuario.tarjetas.length; i++) {
            const ut = usuario.tarjetas[i];
            if (t.id == ut.alfanumerico) {
                existe = true;
                cards.push(ut)
                break;
            }
        }

        if (!existe) {
            return { message: `La tajeta que se desea regalar no existe en el inventario del usuario.` }
        }
    }

    let ExisteCard
    for (let i = 0; i < usuario.tarjetas.length; i++) {
        ExisteCard = true
        const ut = usuario.tarjetas[i];
        for (const t of tarjetas) {
            if (t.alfanumerico == ut.alfanumerico) {
                ExisteCard = false
            }
        }
        if (ExisteCard) {
            cardsUser.push(ut)
        }
    }
    usuario.tarjetas = cardsUser;
    return { usuario: usuario, tarjetas: cards };
}

function modificarInventarioTrjetasUsuario2(usuario, tarjetas) {
    listaTarjetas = []
    let existe;
    for (const t of tarjetas) {
        usuario.tarjetas.push(t);
    }

    return usuario;
}

async function actualizarUsuario(usuario) {
    let userData = {}
    let request = {
        send: (data) => {
            userData = data;
        }
    }

    request.status = () => { return request };

    await controllerUsuario.actualizarUsuario({ params: { username: usuario.username }, body: usuario }, request)

    if (userData.message == `¡No se encontro el usuario!` ||
        userData.message == `Error al actualizar el usuario con username=${usuario.username}.`) {
        return { message: userData.message }
    }

    return userData
}

async function guardarEnHistorial(values, acceptance, cb) {
    const transaccion = new Transaccion({
        usuario1: values.usuario1.trim(),
        usuario2: values.usuario2.trim(),
        tarjetas: values.tarjetas,
        estado: acceptance.estado.trim(),
        mensaje: acceptance.mensaje.trim()
    });

    Transaccion.create(transaccion).then(() => { console.log("Creado"); });

    return cb({ message: acceptance.mensaje });
}

exports.obtenerUsuario = obtenerUsuario;
exports.modificarInventarioTrjetasUsuario1 = modificarInventarioTrjetasUsuario1;
exports.modificarInventarioTrjetasUsuario2 = modificarInventarioTrjetasUsuario2;
exports.actualizarUsuario = actualizarUsuario;
exports.guardarEnHistorial = guardarEnHistorial;
exports.Transaccion = Transaccion;

exports.regalar = async function (req, res) {
    if (!req.body.usuario1 || !req.body.usuario2 || !req.body.giftcards) {
        return res.status(400).send({
            message: "Datos faltantes para dar el regalo."
        });
    }
    let transaccion = {
        usuario1: req.body.usuario1,
        usuario2: req.body.usuario2,
        tarjetas: req.body.giftcards
    };

    let usuario1 = await exports.obtenerUsuario(req.body.usuario1)
    if (!usuario1) {
        return exports.guardarEnHistorial(
            transaccion,
            { mensaje: `No se encontro el usuario ${req.body.usuario1}`, estado: "no aceptado" },
            (obj) => {
                res.status(400).send(obj);
            });
    }

    let usuario2 = await exports.obtenerUsuario(req.body.usuario2)
    if (!usuario2) {
        return exports.guardarEnHistorial(
            transaccion,
            { mensaje: `No se encontro el usuario ${req.body.usuario2}`, estado: "no aceptado" },
            (obj) => {
                res.status(400).send(obj);
            });
    }

    let ret1 = exports.modificarInventarioTrjetasUsuario1(usuario1, req.body.giftcards)
    if (usuario1.message) {
        return exports.guardarEnHistorial(
            transaccion,
            { mensaje: usuario1.message, estado: "no aceptado" },
            (obj) => {
                res.status(400).send(obj);
            });
    }
    usuario1 = ret1.usuario
    let cards = ret1.tarjetas

    usuario2 = exports.modificarInventarioTrjetasUsuario2(usuario2, cards)
    if (usuario2.message) {
        return exports.guardarEnHistorial(
            transaccion,
            { mensaje: usuario2.message, estado: "no aceptado" },
            (obj) => {
                res.status(400).send(obj);
            });
    }

    usuario1 = await exports.actualizarUsuario(usuario1);
    if (usuario1.message != 'Usuario actualizado correctamente.') {
        return exports.guardarEnHistorial(
            transaccion,
            { mensaje: `Error modificando las tarjetas de ${req.body.usuario1}: ${usuario1.message}`, estado: "no aceptado" },
            (obj) => {
                res.status(500).send(obj);
            });
    }

    usuario2 = await exports.actualizarUsuario(usuario2);
    if (usuario2.message != 'Usuario actualizado correctamente.') {
        return exports.guardarEnHistorial(
            transaccion,
            { mensaje: `Error modificando las tarjetas de ${req.body.usuario2}: ${usuario2.message}`, estado: "no aceptado" },
            (obj) => {
                res.status(500).send(obj);
            });
    }

    return exports.guardarEnHistorial(
        transaccion,
        { mensaje: `Tarjeta/s regaladas con exito.`, estado: "aceptado" },
        (obj) => {
            res.status(200).send(obj);
        });
}

exports.transacciones = async function (req, res) {
    if (!req.query.usuario || req.query.usuario != "admin") {
        return res.status(403).send({ message: `El usuario no es admin.` });
    }

    exports.Transaccion
        .find({})
        .then((data) => {
            return res.status(200).send({ transacciones: data });
        })
        .catch((err) => {
            return res.status(500).send({ error: err, message: `Error devolviendo datos` });
        });
}