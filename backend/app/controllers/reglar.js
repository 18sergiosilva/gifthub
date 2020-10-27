const db = require("../models");
const Usuario = db.usuario;
const controllerUsuario = require("../controllers/usuario");
const { testUrl } = require("../models");

exports.Usuario = Usuario;

async function obtenerUsuario(username) {
    let userData = []
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

async function modificarInventarioTrjetasUsuario1(usuario, tarjetas) {
    for (let j = 0; j < tarjetas.length; j++) {
        let existe = true
        for (let i = 0; i < usuario.tarjetas.length; i++) {
            if (usuario.tarjetas[i].id == tarjetas[j].id) {
                existe = false;
                usuario.tarjetas[i].cantidad += tarjetas[j].cantidad
                if (usuario.tarjetas[i].cantidad < 0) {
                    return { message: `No se cuenta con la cantidad suficiente tarjetas para regalar.` };
                }
            }
        }
        if (existe) {
            return `La tajeta que se desea regalar no existe.`
        }
    }
    return usuario;
}

async function modificarInventarioTrjetasUsuario2(usuario, tarjetas) {
    listaTarjetas = []
    for (let j = 0; j < tarjetas.length; j++) {
        let noExiste = true
        for (let i = 0; i < usuario.tarjetas.length; i++) {
            if (usuario.tarjetas[i].id == tarjetas[j].id) {
                noExiste = false;
                usuario.tarjetas[i].cantidad += tarjetas[j].cantidad
            }
        }
        if (noExiste) {
            let giftcard = tarjetas[j]
            giftcard.cantidad = tarjetas[j].cantidad
            listaTarjetas.push(giftcard)
        }
    }
    listaTarjetas.forEach(tarjeta => {
        usuario.tarjetas.push(tarjeta);
    })
    return usuario;
}

async function actualizarUsuario(usuario) {
    let userData = []
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

async function regalarGiftcards(req, res) {
    // Verifica si los datos existen
    if (!req.body.usuario1 || !req.body.usuario2 || !req.body.giftcards) {
        return res.status(400).send({
            message: "Datos faltantes para dar el regalo."
        });
    }
    let usuario1 = await obtenerUsuario(req.body.usuario1)
    if (!usuario1) {
        return res.status(400).send({
            message: `No se encontro el usuario ${req.body.usuario1}`
        });
    }

    let usuario2 = await obtenerUsuario(req.body.usuario2)
    if (!usuario2) {
        return res.status(400).send({
            message: `No se encontro el usuario ${req.body.usuario2}`
        });
    }

    usuario1 = await modificarInventarioTrjetasUsuario1(usuario1, req.body.giftcards)
    if (usuario1.message) {
        res.status(400).send({
            message: usuario1.message
        });
        return
    }

    usuario2 = await modificarInventarioTrjetasUsuario2(usuario2, req.body.giftcards)
    if (usuario2.message) {
        return res.status(400).send({
            message: usuario2.message
        });
    }

    usuario1 = await actualizarUsuario(usuario1);
    if (usuario1.message != 'Usuario actualizado correctamente.') {
        res.status(400).send({
            message: usuario1.message
        });
        return
    }

    usuario2 = await actualizarUsuario(usuario2);
    if (usuario1.message != 'Usuario actualizado correctamente.') {
        res.status(400).send({
            message: usuario2.message
        });
        return
    }


    return res.status(200).send({
        message: `Tarjeta/s regaladas con exito.`,
    });
}

exports.regalarGiftcards = regalarGiftcards

// Regalar giftcards
exports.regalar = (req, res) => {
    regalarGiftcards(req, res)
};

