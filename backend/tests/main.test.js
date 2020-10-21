const chai = require('chai');
const faker = require('faker');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

process.env.TESTING = true;

const api = require('../index');
const controllerUsuario = require('../app/controllers/usuario');
const controllerCrds = require('../app/controllers/cards');
const db = require("../app/models");
const { query } = require('express');

chai.use(chaiHttp);
faker.setLocale('es_MX');

const { expect } = chai;

const Usuario = db.usuario;

var sandbox;
beforeEach(function() {
    sandbox = sinon.createSandbox();
});

afterEach(function() {
    sandbox.restore();
});

const nombre = faker.name.firstName()
const apellido = faker.name.lastName()

const CorrectUserInfo = {
    username: nombre + apellido,
    correo: nombre + apellido + "@USAC.com",
    contrasena: "1234",
    nombres: `${nombre} ${faker.name.firstName()}`,
    apellidos: `${apellido} ${faker.name.lastName()}`,
    dpi: faker.random.number({
        min: 100000000000,
        max: 999999999999
    }),
    edad: faker.random.number({
        min: 20,
        max: 100
    })
};

const IncorrectUserInfo = {
    username: nombre + apellido,
    correo: nombre + apellido + "@USAC.com",
    contrasena: "111111",
    nombres: `${nombre} ${faker.name.firstName()}`,
    apellidos: `${apellido} ${faker.name.lastName()}`,
};

describe('Validaciones en la BD', () => {
    it('Mostrar error cuando no se pueda conectar a la base de datos', async() => {

        let processStub = sandbox.stub(process, 'exit');
        let consoleStub = sandbox.stub(console, 'error');

        await api.dbConnect(`mongodb://errorURL`);

        expect(consoleStub.callCount).to.equal(2);
        expect(consoleStub.firstCall.calledWith('** No se pudo conectar a la base de datos **')).to.be.true;
        expect(consoleStub.secondCall.args[0].toString()).to.include('MongooseError:');

        expect(processStub.callCount).to.equal(1);

    });

});

describe('Historia: Registrar Usuarios', function() {
    describe('POST /', function() {
        it("Guardar un usuario con datos correctos", done => {
            let res = {
                send: () => {},
                status: sinon.stub().returnsThis()
            };

            const mock = sinon.mock(res);

            mock.expects("send").once().withExactArgs({
                message: "El usuario se creo correctamente."
            });

            sandbox.stub(controllerUsuario.Usuario, 'create').returns({
                then: (callBack) => {
                    callBack();

                    expect(res.status.calledOnce).to.be.true;
                    expect(res.status.firstCall.calledWithExactly(200)).to.be.true;

                    mock.verify();

                    done();
                    //return { catch: () => {} }
                }
            });

            controllerUsuario.create({ body: CorrectUserInfo }, res);
        });
        it("Intentar guardar un usuario con datos incorrectos", done => {
            let res = {
                send: () => {},
                status: sinon.stub().returnsThis()
            };

            const mock = sinon.mock(res);

            mock.expects("send").once().withExactArgs({
                message: "Los datos enviados de usuario son incorrectos."
            });

            controllerUsuario.create({ body: IncorrectUserInfo }, res);

            expect(res.status.calledOnce).to.be.true;
            expect(res.status.firstCall.calledWithExactly(400)).to.be.true;

            mock.verify();

            done();
        });
        it("Error de la base de datos al intentar insertar usuarios.", done => {
            let catchStub = sandbox.stub();
            let stub = sandbox.stub(controllerUsuario.Usuario, 'create').returns({
                then: sandbox.stub().callsFake(() => { return { catch: catchStub } }),
            });

            catchStub.callsFake((cb) => {
                cb({ message: "Error al crear el Usuario." }, {});
            });
            let res = {
                send: () => {},
                status: sinon.stub().returnsThis()
            };

            const mock = sinon.mock(res);

            mock.expects("send").once().withExactArgs({
                message: "Error al crear el Usuario."
            });

            controllerUsuario.create({ body: CorrectUserInfo }, res);

            expect(stub.calledOnce).to.be.true;
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.firstCall.calledWithExactly(500)).to.be.true;

            mock.verify();

            done();
        });
    });
    describe('PUT /', () => {
        it("Actualiar un usuario existente", done => {
            let res = {
                send: () => {},
                status: sinon.stub().returnsThis()
            };

            const mock = sinon.mock(res);

            mock.expects("send").once().withExactArgs({
                message: "Usuario actualizado correctamente."
            });

            sandbox.stub(controllerUsuario.Usuario, 'findOneAndUpdate').returns({
                then: (callBack) => {
                    callBack(true);

                    expect(res.status.calledOnce).to.be.true;
                    expect(res.status.firstCall.calledWithExactly(200)).to.be.true;

                    mock.verify();

                    done();
                }
            });

            controllerUsuario.actualizar({ body: IncorrectUserInfo, params: { username: "EAWLL" } }, res);
        });
        it("Actualiar un usuario que no existente", done => {
            let res = {
                send: () => {},
                status: sinon.stub().returnsThis()
            };

            const mock = sinon.mock(res);

            mock.expects("send").once().withExactArgs({
                message: "¡No se encontro el usuario!"
            });

            sandbox.stub(controllerUsuario.Usuario, 'findOneAndUpdate').returns({
                then: (callBack) => {
                    callBack(false);

                    expect(res.status.calledOnce).to.be.true;
                    expect(res.status.firstCall.calledWithExactly(404)).to.be.true;

                    mock.verify();

                    done();
                }
            });

            controllerUsuario.actualizar({ body: IncorrectUserInfo, params: { username: "EAWLL" } }, res);
        });
        it("Intentar actualizar usuario sin enviarle datos", done => {
            let res = {
                send: () => {},
                status: sinon.stub().returnsThis()
            };

            const mock = sinon.mock(res);

            mock.expects("send").once().withExactArgs({
                message: "Los datos a modificar no deben de esta vacios."
            });

            controllerUsuario.actualizar({ body: {}, params: { username: "EAWLL" } }, res);

            expect(res.status.calledOnce).to.be.true;
            expect(res.status.firstCall.calledWithExactly(400)).to.be.true;

            mock.verify();

            done();
        });
        it("Error de la base de datos al intentar actualizar usuarios.", done => {
            let catchStub = sandbox.stub();
            let stub = sandbox.stub(controllerUsuario.Usuario, 'findOneAndUpdate').returns({
                then: sandbox.stub().callsFake(() => { return { catch: catchStub } }),
            });

            catchStub.callsFake((cb) => {
                cb({ message: "Error al actualizar el usuario con username=EAWLL." }, {});
            });
            let res = {
                send: () => {},
                status: sinon.stub().returnsThis()
            };

            const mock = sinon.mock(res);

            mock.expects("send").once().withExactArgs({
                message: "Error al actualizar el usuario con username=EAWLL."
            });

            controllerUsuario.actualizar({ body: CorrectUserInfo, params: { username: "EAWLL" } }, res);

            expect(stub.calledOnce).to.be.true;
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.firstCall.calledWithExactly(500)).to.be.true;

            mock.verify();

            done();
        });
    });
    describe('GET /', () => {
        it("Buscar un usuario existente", done => {
            let res = {
                send: () => {},
                status: sinon.stub().returnsThis()
            };

            const mock = sinon.mock(res);

            mock.expects("send").once().withExactArgs({
                message: "Usuario encontrado.",
                usuario: CorrectUserInfo
            });

            sandbox.stub(controllerUsuario.Usuario, 'findOne').returns({
                then: (callBack) => {
                    callBack(CorrectUserInfo);

                    expect(res.status.calledOnce).to.be.true;
                    expect(res.status.firstCall.calledWithExactly(200)).to.be.true;

                    mock.verify();

                    done();
                }
            });
            controllerUsuario.findOne({ params: { username: nombre + apellido } }, res);
        });
        it("Buscar un usuario que no existente", done => {
            let res = {
                send: () => {},
                status: sinon.stub().returnsThis()
            };

            const mock = sinon.mock(res);

            mock.expects("send").once().withExactArgs({
                message: `Usuario con username=${nombre + apellido} no encontrado.`,
            });

            sandbox.stub(controllerUsuario.Usuario, 'findOne').returns({
                then: (callBack) => {
                    callBack(undefined);

                    expect(res.status.calledOnce).to.be.true;
                    expect(res.status.firstCall.calledWithExactly(404)).to.be.true;

                    mock.verify();

                    done();
                }
            });

            controllerUsuario.findOne({ params: { username: nombre + apellido } }, res);
        });
        it("Error de la base de datos al intentar eliminar un usuarios.", done => {
            let catchStub = sandbox.stub();
            let stub = sandbox.stub(controllerUsuario.Usuario, 'findOne').returns({
                then: sandbox.stub().callsFake(() => { return { catch: catchStub } }),
            });

            catchStub.callsFake((cb) => {
                cb({ message: `Error al devolver el usuario con username=${nombre + apellido}` }, {});
            });
            let res = {
                send: () => {},
                status: sinon.stub().returnsThis()
            };

            const mock = sinon.mock(res);

            mock.expects("send").once().withExactArgs({
                message: `Error al devolver el usuario con username=${nombre + apellido}`
            });

            controllerUsuario.findOne({ params: { username: nombre + apellido } }, res);

            expect(stub.calledOnce).to.be.true;
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.firstCall.calledWithExactly(500)).to.be.true;

            mock.verify();

            done();
        });

    });
    describe('DELETE /', () => {
        it("Eliminar un usuario existente", done => {
            let res = {
                send: () => {},
                status: sinon.stub().returnsThis()
            };

            const mock = sinon.mock(res);

            mock.expects("send").once().withExactArgs({
                message: "Usuario Eliminado",
            });

            sandbox.stub(controllerUsuario.Usuario, 'findOneAndRemove').returns({
                then: (callBack) => {
                    callBack(CorrectUserInfo);

                    expect(res.status.calledOnce).to.be.true;
                    expect(res.status.firstCall.calledWithExactly(200)).to.be.true;

                    mock.verify();

                    done();
                }
            });

            controllerUsuario.delete({ params: { username: nombre + apellido } }, res);
        });
        it("Intentar eliminar un usuario que no existente", done => {
            let res = {
                send: () => {},
                status: sinon.stub().returnsThis()
            };

            const mock = sinon.mock(res);

            mock.expects("send").once().withExactArgs({
                message: `El Usuario ${nombre + apellido} no existe.`,
            });

            sandbox.stub(controllerUsuario.Usuario, 'findOneAndRemove').returns({
                then: (callBack) => {
                    callBack(undefined);

                    expect(res.status.calledOnce).to.be.true;
                    expect(res.status.firstCall.calledWithExactly(404)).to.be.true;

                    mock.verify();

                    done();
                }
            });

            controllerUsuario.delete({ params: { username: nombre + apellido } }, res);
        });
        it("Error de la base de datos al intentar eliminar un usuarios.", done => {
            let catchStub = sandbox.stub();
            let stub = sandbox.stub(controllerUsuario.Usuario, 'findOneAndRemove').returns({
                then: sandbox.stub().callsFake(() => { return { catch: catchStub } }),
            });

            catchStub.callsFake((cb) => {
                cb({ message: `Error al eliminar el usuario ${nombre + apellido}` }, {});
            });
            let res = {
                send: () => {},
                status: sinon.stub().returnsThis()
            };

            const mock = sinon.mock(res);

            mock.expects("send").once().withExactArgs({
                message: `Error al eliminar el usuario ${nombre + apellido}`
            });

            controllerUsuario.delete({ params: { username: nombre + apellido } }, res);

            expect(stub.calledOnce).to.be.true;
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.firstCall.calledWithExactly(500)).to.be.true;

            mock.verify();

            done();
        });
    });
});
describe('Historia: Conectarse a api externa', function() {
    describe('GET /', () => {
        it("Actualizar las giftcards en la base de datos", done => {
            let res = {
                send: () => {},
                status: sinon.stub().returnsThis()
            };

            const mock = sinon.mock(res);

            mock.expects("send").once().withExactArgs({
                message: "giftcards actualizadas"
            });

            sandbox.stub(controllerCrds.axios, 'get').returns({
                then: (callBack) => {
                    callBack({ data: [] });

                    expect(res.status.calledOnce).to.be.true;
                    expect(res.status.firstCall.calledWithExactly(200)).to.be.true;

                    mock.verify();

                    done();
                }
            });
            controllerCrds.actualizar({ params: {} }, res);
        });
        it("Error al realizar la peticion a la api externa", done => {
            let catchStub = sandbox.stub();
            let stub = sandbox.stub(controllerCrds.axios, 'get').returns({
                then: sandbox.stub().callsFake(() => { return { catch: catchStub } }),
            });

            catchStub.callsFake((cb) => {
                cb({ message: `Error al actualizar las giftcards` }, {});
            });
            let res = {
                send: () => {},
                status: sinon.stub().returnsThis()
            };

            const mock = sinon.mock(res);

            mock.expects("send").once().withExactArgs({
                message: `Error al actualizar las giftcards`
            });

            controllerCrds.actualizar({ params: {} }, res);

            expect(stub.calledOnce).to.be.true;
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.firstCall.calledWithExactly(500)).to.be.true;

            mock.verify();

            done();
        });
    });

    describe('Historia: Conectarse a api externa', function() {})
});

describe('Historia: Ver catalogo giftcards', function() {
    describe('GET /', () => {
        it("Obtiene las giftcars de la base de datos", done => {
            let res = {
                send: () => {},
                status: sinon.stub().returnsThis()
            };

            const mock = sinon.mock(res);

            mock.expects("send").once().withExactArgs({
                message: "Se devolvieron las giftcards.",
                cards: []
            });

            sandbox.stub(controllerCrds.Card, 'find').returns({
                then: (callBack) => {
                    callBack([]);

                    expect(res.status.calledOnce).to.be.true;
                    expect(res.status.firstCall.calledWithExactly(200)).to.be.true;

                    mock.verify();

                    done();
                }
            });
            controllerCrds.getAll({ params: {} }, res);
        });
        it("Error de la base de datos al obtener las giftcards", done => {
            let catchStub = sandbox.stub();
            let stub = sandbox.stub(controllerCrds.Card, 'find').returns({
                then: sandbox.stub().callsFake(() => { return { catch: catchStub } }),
            });

            catchStub.callsFake((cb) => {
                cb({ message: `Error de la base de datos al devolver las giftcards` }, {});
            });
            let res = {
                send: () => {},
                status: sinon.stub().returnsThis()
            };

            const mock = sinon.mock(res);

            mock.expects("send").once().withExactArgs({
                message: `Error de la base de datos al devolver las giftcards`
            });

            controllerCrds.getAll({ params: {} }, res);

            expect(stub.calledOnce).to.be.true;
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.firstCall.calledWithExactly(500)).to.be.true;

            mock.verify();

            done();
        });
    });
});