
const chai = require('chai');
const sinon = require('sinon');

const regalar = require('../app/controllers/reglar');
const controllerUsuario = require("../app/controllers/usuario");

const { expect } = chai;
process.env.TESTING = true;

var sandbox;
beforeEach(function () {
    sandbox = sinon.createSandbox();
});

afterEach(function () {
    sandbox.restore();
});

describe('Regalar GiftCards', () => {
    it('Buscar un usuario en la base de datos', async () => {
        sandbox.stub(controllerUsuario, 'buscarUsuario').callsFake((param, req) => {
            req.send({ usuario: { name: param.params.username } });
        });

        let result = await regalar.obtenerUsuario("testing");

        expect(result).to.be.an("object");
        expect(result.name).to.equal("testing");
    });

    it('Retornar indefinido si el usuario no es encontrado', async () => {
        sandbox.stub(controllerUsuario, 'buscarUsuario').callsFake((param, req) => {
            req.send({ message: `Usuario con username=testing no encontrado.` });
        });

        let result = await regalar.obtenerUsuario("testing");

        expect(result).to.equal(undefined);
    });

    it('El usuario que regala es retornado con exito', (done) => {

        const usuario = {
            tarjetas: [
                { id: 1, cantidad: 1 },
                { id: 2, cantidad: 2 },
                { id: 3, cantidad: 3 },
                { id: 4, cantidad: 4 },
                { id: 5, cantidad: 5 }
            ]
        }

        const tarjetas_a_regalar = [
            { id: 2, cantidad: 2 },
            { id: 5, cantidad: 3 }
        ]

        let result = regalar.modificarInventarioTrjetasUsuario1(usuario, tarjetas_a_regalar);

        const salida_esperada = {
            tarjetas: [
                { id: 1, cantidad: 1 },
                { id: 2, cantidad: 0 }, // quedan 0 tarjetas
                { id: 3, cantidad: 3 },
                { id: 4, cantidad: 4 },
                { id: 5, cantidad: 2 }  // solo hay 2 tarjetas                
            ]
        }

        expect(result).to.be.an("object");
        expect(result).to.deep.equal(salida_esperada);

        done();
    });

    it('Si la nueva cantidad es menor que cero, retorna un mensaje de cantidad insuficiente', (done) => {
        const usuario = {
            tarjetas: [
                { id: 1, cantidad: 1 },
                { id: 2, cantidad: 2 },
            ]
        }

        const tarjetas_a_regalar = [
            { id: 2, cantidad: 100 } //muchas mas tarjetas de las que tiene el usuario
        ]

        let result = regalar.modificarInventarioTrjetasUsuario1(usuario, tarjetas_a_regalar);

        const salida_esperada = {
            message: `No se cuenta con la cantidad suficiente tarjetas para regalar.`
        }

        expect(result).to.deep.equal(salida_esperada);

        done();
    });

    it('Si no existe la tarjeta en el inventario del usuario que regala, devuelve un error', (done) => {
        const usuario = {
            tarjetas: [
                { id: 1, cantidad: 1 },
                { id: 2, cantidad: 2 },
            ]
        }

        const tarjetas_a_regalar = [
            { id: 3, cantidad: 100 } //muchas mas tarjetas de las que tiene el usuario
        ]

        let result = regalar.modificarInventarioTrjetasUsuario1(usuario, tarjetas_a_regalar);

        const salida_esperada = {
            message: `La tajeta que se desea regalar no existe en el inventario del usuario.`
        }

        expect(result).to.deep.equal(salida_esperada);

        done();
    });

    it('Agregar al usuario que le regalan la cantidad nueva de una tarjeta', (done) => {
        const usuario = {
            tarjetas: [
                { id: 1, cantidad: 1 },
            ]
        }

        const tarjetas_a_regalar = [
            { id: 1, cantidad: 2 },
            { id: 3, cantidad: 100 }
        ]

        let result = regalar.modificarInventarioTrjetasUsuario2(usuario, tarjetas_a_regalar);

        const salida_esperada = {
            tarjetas: [
                { id: 1, cantidad: 3 },
                { id: 3, cantidad: 100 }
            ]
        }

        expect(result).to.deep.equal(salida_esperada);

        done();
    });

    it('Actualizar usuario devuelve datos del usuario de manera correcta', async () => {
        sandbox.stub(controllerUsuario, 'actualizarUsuario').callsFake((param, req) => {
            req.send({ usuario: { name: param.params.username } });
        });

        let result = await regalar.actualizarUsuario({ username: "testing" });

        expect(result).to.be.an("object");
        expect(result.usuario.name).to.equal("testing");
    });

    it('Actualizar usuario devuelve un mensaje de error cuando hay un error modificandolo', async () => {

        sandbox.stub(controllerUsuario, 'actualizarUsuario').callsFake((param, req) => {
            req.send({ message: `¡No se encontro el usuario!` });
        });

        let result = await regalar.actualizarUsuario("testing");

        expect(result.usuario).to.equal(undefined);
        expect(result.message).to.equal(`¡No se encontro el usuario!`);
    });

    it('Regalar giftcard devuelve error si hay datos faltantes', async () => {

        const res = {
            send: () => { },
            status: sinon.stub().returnsThis()
        };

        const mock = sinon.mock(res);

        mock.expects("send").once().withExactArgs({
            message: "Datos faltantes para dar el regalo."
        });

        await regalar.regalar({ body: {} }, res);

        expect(res.status.firstCall.calledWithExactly(400)).to.be.true;

        mock.verify();
    });

    it('Si no se encuentra el usuario que regala devuelve un error 404', async () => {

        const res = {
            send: () => { },
            status: sinon.stub().returnsThis()
        };

        const mock = sinon.mock(res);

        mock.expects("send").once().withExactArgs({
            message: "No se encontro el usuario leo"
        });

        sandbox.stub(regalar, 'obtenerUsuario').resolves(undefined);

        await regalar.regalar({ body: { usuario1: "leo", usuario2: "edgar", giftcards: [] } }, res);

        expect(res.status.calledOnce).to.be.true;
        expect(res.status.firstCall.calledWithExactly(400)).to.be.true;

        mock.verify();
    });

    it('Si no se encuentra el usuario al que regalan devuelve un error 404', async () => {

        const res = {
            send: () => { },
            status: sinon.stub().returnsThis()
        };

        const mock = sinon.mock(res);

        mock.expects("send").once().withExactArgs({
            message: "No se encontro el usuario edgar"
        });

        sandbox.stub(regalar, 'obtenerUsuario').callsFake(username => {
            if (username == "edgar") {
                return undefined;
            }
            else if (username == "leo") {
                return true;
            }
        });

        await regalar.regalar({ body: { usuario1: "leo", usuario2: "edgar", giftcards: [] } }, res);

        expect(res.status.calledOnce).to.be.true;
        expect(res.status.firstCall.calledWithExactly(400)).to.be.true;

        mock.verify();
    });

    it('Si hay un error modificando las tarjetas del usuario que regala devuelve un error 400', async () => {

        const res = {
            send: () => { },
            status: sinon.stub().returnsThis()
        };
        const mock = sinon.mock(res);

        mock.expects("send").once().withExactArgs({
            message: "Error!"
        });

        sandbox.stub(regalar, 'obtenerUsuario').returns(true);
        sandbox.stub(regalar, 'modificarInventarioTrjetasUsuario1').returns({ message: 'Error!' });

        await regalar.regalar({ body: { usuario1: "leo", usuario2: "edgar", giftcards: [] } }, res);

        expect(res.status.calledOnce).to.be.true;
        expect(res.status.firstCall.calledWithExactly(400)).to.be.true;

        mock.verify();
    });

    it('Si hay un error modificando las tarjetas del usuario al que regalan devuelve un error 400', async () => {

        const res = {
            send: () => { },
            status: sinon.stub().returnsThis()
        };
        const mock = sinon.mock(res);

        mock.expects("send").once().withExactArgs({
            message: "Error!"
        });

        sandbox.stub(regalar, 'obtenerUsuario').returns(true);
        sandbox.stub(regalar, 'modificarInventarioTrjetasUsuario1').returns(true);
        sandbox.stub(regalar, 'modificarInventarioTrjetasUsuario2').returns({ message: 'Error!' });

        await regalar.regalar({ body: { usuario1: "leo", usuario2: "edgar", giftcards: [] } }, res);

        expect(res.status.calledOnce).to.be.true;
        expect(res.status.firstCall.calledWithExactly(400)).to.be.true;

        mock.verify();
    });

    it('Si hay un error modificando al usuario que regala muestra un error', async () => {
        const res = {
            send: () => { },
            status: sinon.stub().returnsThis()
        };
        const mock = sinon.mock(res);

        mock.expects("send").once().withExactArgs({
            message: "Error modificando las tarjetas de leo: Error"
        });

        sandbox.stub(regalar, 'obtenerUsuario').returns(true);
        sandbox.stub(regalar, 'modificarInventarioTrjetasUsuario1').returns(true);
        sandbox.stub(regalar, 'modificarInventarioTrjetasUsuario2').returns(true);
        sandbox.stub(regalar, 'actualizarUsuario').returns({ message: 'Error'});

        await regalar.regalar({ body: { usuario1: "leo", usuario2: "edgar", giftcards: [] } }, res);

        expect(res.status.calledOnce).to.be.true;
        expect(res.status.firstCall.calledWithExactly(500)).to.be.true;

        mock.verify();
    });
    
    it('Si hay un error modificando al usuario que le regalaron muestra un error', async () => {
        const res = {
            send: () => { },
            status: sinon.stub().returnsThis()
        };
        const mock = sinon.mock(res);

        mock.expects("send").once().withExactArgs({
            message: "Error modificando las tarjetas de edgar: Error"
        });

        sandbox.stub(regalar, 'obtenerUsuario').returns(true);
        sandbox.stub(regalar, 'modificarInventarioTrjetasUsuario1').returns({ username: "leo"});
        sandbox.stub(regalar, 'modificarInventarioTrjetasUsuario2').returns({ username: "edgar" });
        sandbox.stub(regalar, 'actualizarUsuario').callsFake((p) =>{
            if (p.username === "edgar"){
                return { message: 'Error'};
            }
            else {
                return { message: 'Usuario actualizado correctamente.' };
            }
        });

        await regalar.regalar({ body: { usuario1: "leo", usuario2: "edgar", giftcards: [] } }, res);

        expect(res.status.calledOnce).to.be.true;
        expect(res.status.firstCall.calledWithExactly(500)).to.be.true;

        mock.verify();
    });

    it('Devuelve un codigo 200 si las tarjetas fueron regaladas con exito', async () => {
        const res = {
            send: () => { },
            status: sinon.stub().returnsThis()
        };
        const mock = sinon.mock(res);

        mock.expects("send").once().withExactArgs({
            message: "Tarjeta/s regaladas con exito."
        });

        sandbox.stub(regalar, 'obtenerUsuario').returns(true);
        sandbox.stub(regalar, 'modificarInventarioTrjetasUsuario1').returns({ username: "leo"});
        sandbox.stub(regalar, 'modificarInventarioTrjetasUsuario2').returns({ username: "edgar" });
        sandbox.stub(regalar, 'actualizarUsuario').returns({ message: 'Usuario actualizado correctamente.'});

        await regalar.regalar({ body: { usuario1: "leo", usuario2: "edgar", giftcards: [] } }, res);

        expect(res.status.calledOnce).to.be.true;
        expect(res.status.firstCall.calledWithExactly(200)).to.be.true;

        mock.verify();
    });

    it('Devuelve error si al requerir las transacciones no se es un usuario admin', async () => {
        const res = {
            send: () => { },
            status: sinon.stub().returnsThis()
        };
        const mock = sinon.mock(res);

        mock.expects("send").once().withExactArgs({
            message: "El usuario no es admin."
        });

        await regalar.transacciones({query: { usuario: 'leo' }}, res);
        
        expect(res.status.calledOnce).to.be.true;
        expect(res.status.firstCall.calledWithExactly(403)).to.be.true;

        mock.verify();
    });

    it('Devuelve una lista de transacciones si el usuario es admin', (done) => {
        const res = {
            send: () => { },
            status: sinon.stub().returnsThis()
        };
        const mock = sinon.mock(res);

        mock.expects("send").once().withExactArgs({
            transacciones: []
        });

        sandbox.stub(regalar.Transaccion, 'find').returns(
            {
                then: (callBack) => {
                    callBack([]);

                    expect(res.status.calledOnce).to.be.true;
                    expect(res.status.firstCall.calledWithExactly(200)).to.be.true;

                    mock.verify();

                    done();

                    return { catch: () => { } }
                }
            }
        );

        regalar.transacciones({query: { usuario: 'admin' }}, res);
    });

    it('Devuelve un error 500 si existe un error en la base de datos', (done) => {
        const res = {
            send: () => { },
            status: sinon.stub().returnsThis()
        };
        const mock = sinon.mock(res);

        mock.expects("send").once().withExactArgs({
            message: "Error devolviendo datos",
            error: "Error interno de la base de datos"
        });

        sandbox.stub(regalar.Transaccion, 'find').returns(
            {
                then: sandbox.stub().returnsThis(),                
                catch: (callBack) => {

                    callBack("Error interno de la base de datos");

                    expect(res.status.calledOnce).to.be.true;
                    expect(res.status.firstCall.calledWithExactly(500)).to.be.true;

                    mock.verify();

                    done();
                }
            }
        );

        regalar.transacciones({query: { usuario: 'admin' }}, res);
    });
    

});




