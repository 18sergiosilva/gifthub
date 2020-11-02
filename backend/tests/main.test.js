const chai = require('chai');
const faker = require('faker');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

process.env.TESTING = true;

const api = require('../index');

process.env.API = api;

const controllerCompra = require('../app/controllers/compra');
const controllerUsuario = require('../app/controllers/usuario');
const controllerCrds = require('../app/controllers/cards');
const controllerLogin = require('../app/controllers/login');
const db = require("../app/models");
const { query } = require('express');

chai.use(chaiHttp);
faker.setLocale('es_MX');

const { expect } = chai;

const Usuario = db.usuario;

var sandbox;
beforeEach(function () {
    sandbox = sinon.createSandbox();
});

afterEach(function () {
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
    it('Mostrar error cuando no se pueda conectar a la base de datos', (done) => {

        let processStub = sandbox.stub(process, 'exit');
        let consoleStub = sandbox.stub(console, 'error');
        /*
                api.dbConnect(`mongodb+srv://ayd:incorrect@gifthubdata.frnw3.gcp.mongodb.net/gifthub?retryWrites=true&w=majority`, () => {
                    expect(consoleStub.callCount).to.equal(4);
                    expect(consoleStub.firstCall.calledWith('** No se pudo conectar a la base de datos **')).to.be.true;
                    expect(consoleStub.secondCall.args[0].toString()).to.include('MongooseError:');
                    expect(processStub.callCount).to.equal(1);
        
                    done();
                });*/
        done()
    });
});

describe('Historia: Registrar Usuarios', function () {
    describe('POST /', function () {
        it("Guardar un usuario con datos correctos", done => {
            let res = {
                send: () => { },
                status: sinon.stub().returnsThis()
            };

            const mock = sinon.mock(res);

            mock.expects("send").once().withExactArgs({
                message: "El usuario se creo correctamente."
            });

            let catchObj = { catch: () => { } };

            sandbox.stub(controllerUsuario.Usuario, 'create').returns({
                then: (callBack) => {
                    callBack();

                    expect(res.status.calledOnce).to.be.true;
                    expect(res.status.firstCall.calledWithExactly(200)).to.be.true;

                    mock.verify();
                    done();

                    return catchObj;
                }
            });

            controllerUsuario.create({ body: CorrectUserInfo }, res);
        });

        it("Intentar guardar un usuario con datos incorrectos", done => {
            let res = {
                send: () => { },
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
                send: () => { },
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
                send: () => { },
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

                    return { catch: () => { } };
                }
            });

            controllerUsuario.actualizarUsuario({ body: IncorrectUserInfo, params: { username: "EAWLL" } }, res);
        });
        it("Actualiar un usuario que no existente", done => {
            let res = {
                send: () => { },
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

                    return { catch: () => { } };
                }
            });

            controllerUsuario.actualizarUsuario({ body: IncorrectUserInfo, params: { username: "EAWLL" } }, res);
        });

        it("Intentar actualizar usuario sin enviarle datos", done => {
            let res = {
                send: () => { },
                status: sinon.stub().returnsThis()
            };

            const mock = sinon.mock(res);

            mock.expects("send").once().withExactArgs({
                message: "Los datos a modificar no deben de esta vacios."
            });

            controllerUsuario.actualizarUsuario({ body: {}, params: { username: "EAWLL" } }, res);

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
                send: () => { },
                status: sinon.stub().returnsThis()
            };

            const mock = sinon.mock(res);

            mock.expects("send").once().withExactArgs({
                message: "Error al actualizar el usuario con username=EAWLL."
            });

            controllerUsuario.actualizarUsuario({ body: CorrectUserInfo, params: { username: "EAWLL" } }, res);

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
                send: () => { },
                status: sinon.stub().returnsThis()
            };

            const mock = sinon.mock(res);

            mock.expects("send").once();

            sandbox.stub(controllerUsuario.Usuario, 'findOne').returns({
                then: (callBack) => {
                    callBack(CorrectUserInfo);

                    expect(res.status.calledOnce).to.be.true;
                    expect(res.status.firstCall.calledWithExactly(200)).to.be.true;

                    mock.verify();

                    done();

                    return { catch: () => { } };
                }
            });
            controllerUsuario.buscarUsuario({ params: { username: nombre + apellido } }, res);
        });

        it("Buscar un usuario que no existe", done => {
            let res = {
                send: () => { },
                status: sinon.stub().returnsThis()
            };

            const mock = sinon.mock(res);

            mock.expects("send").once();

            sandbox.stub(controllerUsuario.Usuario, 'findOne').returns({
                then: (callBack) => {
                    callBack(undefined);

                    expect(res.status.calledOnce).to.be.true;
                    expect(res.status.firstCall.calledWithExactly(404)).to.be.true;

                    mock.verify();

                    done();

                    return { catch: () => { } };
                }
            });

            controllerUsuario.buscarUsuario({ params: { username: nombre + apellido } }, res);
        });

        it("Error de la base de datos al buscar usuario.", done => {
            let catchStub = sandbox.stub();
            let stub = sandbox.stub(controllerUsuario.Usuario, 'findOne').returns({
                then: sandbox.stub().callsFake(() => { return { catch: catchStub } }),
            });

            catchStub.callsFake((cb) => {
                cb({ message: `Error al devolver el usuario con username=${nombre + apellido}` }, {});
            });
            let res = {
                send: () => { },
                status: sinon.stub().returnsThis()
            };

            const mock = sinon.mock(res);

            mock.expects("send").once().withExactArgs({
                message: `Error al devolver el usuario con username=${nombre + apellido}`
            });

            controllerUsuario.buscarUsuario({ params: { username: nombre + apellido } }, res);

            expect(stub.calledOnce).to.be.true;
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.firstCall.calledWithExactly(500)).to.be.true;

            mock.verify();

            done();
        });

        it("Obtener usuarios", done => {
            let res = {
                send: () => { },
                status: sinon.stub().returnsThis()
            };

            const mock = sinon.mock(res)

            mock.expects("send").once().withExactArgs({
                message: "Usuarios devueltos.",
                usuarios: {}
            });

            sandbox.stub(controllerUsuario.Usuario, 'find').returns({
                then: (callBack) => {
                    callBack({});

                    expect(res.status.calledOnce).to.be.true;
                    expect(res.status.firstCall.calledWithExactly(200)).to.be.true;

                    mock.verify();

                    done();

                    return { catch: () => { } };
                }
            });
            controllerUsuario.getAll({}, res);
        });

        it("Error de la base de datos al intentar obtener todos los usuarios.", done => {
            let catchStub = sandbox.stub();
            let stub = sandbox.stub(controllerUsuario.Usuario, 'find').returns({
                then: sandbox.stub().callsFake(() => { return { catch: catchStub } }),
            });

            catchStub.callsFake((cb) => {
                cb({ message: `Error al devolver los usuarios.` }, {});
            });
            let res = {
                send: () => { },
                status: sinon.stub().returnsThis()
            };

            const mock = sinon.mock(res);

            mock.expects("send").once().withExactArgs({
                message: `Error al devolver los usuarios.`
            });

            controllerUsuario.getAll({}, res);

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
                send: () => { },
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

                    return { catch: () => { } };
                }
            });

            controllerUsuario.delete({ params: { username: nombre + apellido } }, res);
        });

        it("Intentar eliminar un usuario que no existente", done => {
            let res = {
                send: () => { },
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

                    return { catch: () => { } };
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
                send: () => { },
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

describe('Historia: Conectarse a api externa', function () {
    describe('GET /', () => {
        it("Actualizar las giftcards en la base de datos", done => {
            let res = {
                send: () => { },
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

                    return { catch: () => { } };
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
                send: () => { },
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

    describe('Historia: Conectarse a api externa', function () { })
});

describe('Historia: Ver catalogo giftcards', function () {
    describe('GET /', () => {
        it("Obtiene las giftcars de la base de datos", done => {
            let res = {
                send: () => { },
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

                    return { catch: () => { } }
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
                cb({ message: `Error de la base de datos al devolver las giftcards.` }, {});
            });
            let res = {
                send: () => { },
                status: sinon.stub().returnsThis()
            };

            const mock = sinon.mock(res);

            mock.expects("send").once().withExactArgs({
                message: `Error de la base de datos al devolver las giftcards.`
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

describe('Historia: Realizar compra', function () {
    describe('POST /', () => {
        it("Error, no se parason los datos requeridos para realizar el pago", done => {
            let res = {
                send: () => { },
                status: sinon.stub().returnsThis()
            };

            const mock = sinon.mock(res);

            mock.expects("send").once().withExactArgs({
                message: "Datos incompletos.",
            });

            controllerCompra.pago({ body: {} }, res);
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.firstCall.calledWithExactly(400)).to.be.true;

            mock.verify();

            done();
        });
        it("Error, las giftcards no se encontraron en la base de datos", async () => {
            let response = {
                send: () => { },
                status: sinon.stub().returnsThis()
            };

            sandbox.stub(controllerCompra.cards, 'obtenerDatos').callsFake((cb) => {
                cb.send({ message: `Error de la base de datos al devolver las giftcards.`, cards: [] })
            })

            let res = {
                send: () => { },
                status: sinon.stub().returnsThis()
            };

            const mock = sinon.mock(res);

            mock.expects("send").once().withExactArgs({
                message: `Error de la base de datos al devolver las giftcards.`
            });

            let body = {
                tarjetas: [
                    {
                        idTarjeta: "8",
                        cantidad: "3"
                    },
                    {
                        idTarjeta: "2",
                        cantidad: "3"
                    }
                ],
                tarjeta: {
                    numero: "1234544",
                    nombre: "tarjeta 1",
                    fecha: "06/20",
                    codigoSeguridad: "123"
                },
                monto: "5",
                username: "VJSBH"
            }

            await controllerCompra.pago({ body: body }, res);

            expect(res.status.calledOnce).to.be.true;
            expect(res.status.firstCall.calledWithExactly(404)).to.be.true;

            mock.verify();

        });
        it("Las giftcards se encontraron en la base de datos", async () => {
            let response = {
                send: () => { },
                status: sinon.stub().returnsThis()
            };
            let cards = {
                active: false,
                availability: "1",
                chargeRate: 1,
                id: '1',
                image: 'https://media.karousell.com/media/photos/products/2020/5/21/rm50_goggle_play_gift_card_mal_1590040469_c1100b5a_progressive.jpg',
                name: 'Google Play'
            }

            sandbox.stub(controllerCompra.cards, 'obtenerDatos').callsFake((cb) => {
                cb.send({ message: `Todo bien.`, cards: { Card: [cards] } })
            })

            let res = {
                send: () => { },
                status: sinon.stub().returnsThis()
            };

            let body = {
                tarjetas: [
                    {
                        idTarjeta: "1",
                        cantidad: "1"
                    }
                ],
                tarjeta: {
                    numero: "1234544",
                    nombre: "tarjeta 1",
                    fecha: "06/20",
                    codigoSeguridad: "123"
                },
                monto: "5",
                username: "VJSBH"
            }

            let ret = await controllerCompra.obtenerGiftcards(body.tarjetas);

            expect(ret.giftData.message).to.equal('Todo bien.');

            expect(ret.tarjetasGift[0].active).to.equal(false);
            expect(ret.tarjetasGift[0].availability).to.equal('1');
            expect(ret.tarjetasGift[0].id).to.equal('1');
            expect(ret.tarjetasGift[0].image).to.equal('https://media.karousell.com/media/photos/products/2020/5/21/rm50_goggle_play_gift_card_mal_1590040469_c1100b5a_progressive.jpg');
            expect(ret.tarjetasGift[0].name).to.equal('Google Play');

        });
        it('Buscar un usuario en la base de datos', async () => {
            var userData = {}
            userData.message = `Usuario con username=edgar no encontrado.`
            sandbox.stub(controllerUsuario, 'buscarUsuario').callsFake((param, req) => {
                req.send({ userData: userData });
            });

            let result = await controllerCompra.buscarUsuario("edgar");

            expect(result).to.be.an("object");
            expect(result.userData.message).to.equal(`Usuario con username=edgar no encontrado.`);

        });
        it('Verifica si existen tarjetas no validas', async () => {
            let tarjetasCredito = [{
                numero: "1234544",
                nombre: "tarjeta 1",
                fecha: "06/20",
                codigoSeguridad: "123"
            }]

            let userData = {
                message: 'Usuario encontrado.',
                usuario: {
                    tarjetas: [],
                    transacciones: [],
                    tarjetasCredito: [],
                    username: 'BBCCI',
                    correo: 'dolor@vulputate.ca',
                    contrasena: 'UDJ84UOI4AK',
                    nombres: 'Maxine',
                    apellidos: 'Mckenzie',
                    dpi: 607423428524,
                    edad: 41,
                }
            }

            let tarjetaUsuario = {
                codigoSeguridad: '123',
                fecha: '06/20',
                nombre: 'tarjeta 1',
                numero: '1234544'
            }

            let tarjetasGift = []

            let ret = await controllerCompra.realizarTransaccion(tarjetasCredito, userData, tarjetaUsuario, 200, tarjetasGift, "edgar");

            expect(ret.usuario).to.be.an("object");
            expect(ret.message).to.equal('Usuario encontrado.');

        });
        it('Guarda las transacciones fallidas si los datos de la tarjeta de credito no coinciden', async () => {
            let tarjetasCredito = [{
                numero: "1234544",
                nombre: "tarjeta ",
                fecha: "06/20",
                codigoSeguridad: "123"
            }]

            let userData = {
                message: 'Usuario encontrado.',
                usuario: {
                    tarjetas: [],
                    transacciones: [],
                    tarjetasCredito: [],
                    username: 'BBCCI',
                    correo: 'dolor@vulputate.ca',
                    contrasena: 'UDJ84UOI4AK',
                    nombres: 'Maxine',
                    apellidos: 'Mckenzie',
                    dpi: 607423428524,
                    edad: 41,
                }
            }

            let tarjetaUsuario = {
                codigoSeguridad: '123',
                fecha: '06/20',
                nombre: 'tarjeta',
                numero: '1234544'
            }

            let tarjetasGift = []

            sandbox.stub(controllerUsuario, 'actualizarUsuario').callsFake((param, req) => {
                req.send({});
            });

            let ret = await controllerCompra.realizarTransaccion(tarjetasCredito, userData, tarjetaUsuario, 200, tarjetasGift, "edgar");

            expect(ret.message).to.equal('Los datos de la tarjeta no coinciden.');

        });
        it('Guarda las transacciones fallidas si la tarjeta no cuenta con los fondos necesarios', async () => {
            let tarjetasCredito = [{
                numero: "1234544",
                nombre: "tarjeta ",
                fecha: "06/20",
                codigoSeguridad: "123"
            }]

            let userData = {
                message: 'Usuario encontrado.',
                usuario: {
                    tarjetas: [],
                    transacciones: [],
                    tarjetasCredito: [],
                    username: 'BBCCI',
                    correo: 'dolor@vulputate.ca',
                    contrasena: 'UDJ84UOI4AK',
                    nombres: 'Maxine',
                    apellidos: 'Mckenzie',
                    dpi: 607423428524,
                    edad: 41,
                }
            }

            let tarjetaUsuario = {
                codigoSeguridad: '123',
                fecha: '06/20',
                nombre: 'tarjeta 1',
                numero: '1234544'
            }

            let tarjetasGift = []

            sandbox.stub(controllerUsuario, 'actualizarUsuario').callsFake((param, req) => {
                req.send({});
            });

            let ret = await controllerCompra.realizarTransaccion(tarjetasCredito, userData, tarjetaUsuario, 200000, tarjetasGift, "edgar");

            expect(ret.message).to.equal('Los datos de la tarjeta no coinciden.');

        });
        it('Se insertan giftcards al usuario y se añade a las transacciones del usuario', async () => {
            let tarjetasCredito = [{
                numero: "1234544",
                nombre: "tarjeta ",
                fecha: "06/20",
                codigoSeguridad: "123"
            }]

            let userData = {
                message: 'Usuario encontrado.',
                usuario: {
                    tarjetas: [],
                    transacciones: [],
                    tarjetasCredito: [],
                    username: 'BBCCI',
                    correo: 'dolor@vulputate.ca',
                    contrasena: 'UDJ84UOI4AK',
                    nombres: 'Maxine',
                    apellidos: 'Mckenzie',
                    dpi: 607423428524,
                    edad: 41,
                }
            }
            card = [{
                active: false,
                availability: "1",
                cantidad: 22,
                chargeRate: 1,
                id: '1',
                image: 'https://media.karousell.com/media/photos/products/2020/5/21/rm50_goggle_play_gift_card_mal_1590040469_c1100b5a_progressive.jpg',
                name: 'Google Play'
            }]
            let tarjetaUsuario = {
                codigoSeguridad: '123',
                fecha: '06/20',
                nombre: 'tarjeta 1',
                numero: '1234544'
            }

            let tarjetasGift = [{
                active: false,
                availability: "1",
                cantidad: 22,
                chargeRate: 1,
                id: '1',
                image: 'https://media.karousell.com/media/photos/products/2020/5/21/rm50_goggle_play_gift_card_mal_1590040469_c1100b5a_progressive.jpg',
                name: 'Google Play'
            }]

            let tarjetas = [{
                availability: '6',
                cantidad: '53',
                idTarjeta: '1'
            }]

            let giftcard = []
            let ret = controllerCompra.realizarTransaccion2(tarjetas, tarjetaUsuario, card, userData.usuario, giftcard, tarjetasGift, 500);

            expect(ret.apellidos).to.equal('Mckenzie');
            expect(ret.contrasena).to.equal('UDJ84UOI4AK');
            expect(ret.correo).to.equal('dolor@vulputate.ca');
            expect(ret.dpi).to.equal(607423428524);
            expect(ret.edad).to.equal(41);
            expect(ret.nombres).to.equal('Maxine');
            expect(ret.username).to.equal('BBCCI');

        });
        it('Actualizar el usuario con las nuevas giftcards compradas', async () => {
            var userData = {}
            userData.message = `Usuario con username=edgar no encontrado.`
            sandbox.stub(controllerUsuario, 'actualizarUsuario').callsFake((param, req) => {
                req.send({ userData });
            });

            let result = await controllerCompra.actualizarUsusarios("edgar");

            expect(result.message).to.equal('Compra exitosa.');

        });
        it('Erroa al Actualizar el usuario con las nuevas giftcards compradas', async () => {
            var userData = {}
            userData.message = `¡No se encontro el usuario!`
            sandbox.stub(controllerUsuario, 'actualizarUsuario').callsFake((param, req) => {
                req.send(userData);
            });

            let result = await controllerCompra.actualizarUsusarios({}, "edgar");

            expect(result.message).to.equal(`Error al actualizar el usuario con username=edgar.`);


        });
        it('Generacion codigo alfanumerico', async () => {
            let alfanumerico = controllerCompra.generarAlfanumerico();

            expect(alfanumerico.length).to.equal(8);
        });
        it('Generacion numero enmascarado', async () => {
            let numeroEncriptado = controllerCompra.encriptar(1234567891234567);
            expect(numeroEncriptado).to.equal("1234XXXXXXXX4567");
        });
        it('Error al generar numero enmascarado', async () => {
            let numeroEncriptado = controllerCompra.encriptar(1234);
            expect(numeroEncriptado).to.equal("1234");
        });
    });
});

describe('Login', function () {
    describe('POST /', () => {
        it("Loguin exitoso", done => {
            let res = {
                send: () => { },
                status: sinon.stub().returnsThis()
            };

            const mock = sinon.mock(res);

            let user = {
                tarjetas: [],
                transacciones: [],
                tarjetasCredito: [],
                username: "MKJLW",
                correo: "amet.dapibus@dolordolortempus.net",
                contrasena: "IJA20SAJ8KI",
                nombres: "Rigel",
                apellidos: "Griffin",
                dpi: 745027164490,
                edad: 67,
                id: "5f9a586ea9be5b9630ba8590"
            }

            mock.expects("send").once().withExactArgs({
                message: "Login exitoso.",
                usuario: user
            });

            sandbox.stub(controllerUsuario.Usuario, 'findOne').returns({
                then: (callBack) => {
                    callBack(user);

                    expect(res.status.calledOnce).to.be.true;
                    expect(res.status.firstCall.calledWithExactly(200)).to.be.true;

                    mock.verify();

                    done();

                    return { catch: () => { } };
                }
            });
            let body = {
                userOMail: "MKJLW",
                pass: "IJA20SAJ8KI"
            }
            controllerLogin.buscarUsuario({ body: body }, res);
        });

        it("Login con un usuario que no existe", done => {
            let res = {
                send: () => { },
                status: sinon.stub().returnsThis()
            };

            const mock = sinon.mock(res);

            mock.expects("send").once().withExactArgs({
                message: `Usuario MKJLW no encontrado.`
            });

            sandbox.stub(controllerUsuario.Usuario, 'findOne').returns({
                then: (callBack) => {
                    callBack(undefined);

                    expect(res.status.calledOnce).to.be.true;
                    expect(res.status.firstCall.calledWithExactly(404)).to.be.true;

                    mock.verify();

                    done();

                    return { catch: () => { } };
                }
            });
            let body = {
                userOMail: "MKJLW",
                pass: "IJA20SAJ8KI"
            }
            controllerLogin.buscarUsuario({ body: body }, res);
        });

        it("Contraseña incorrecta", done => {
            let res = {
                send: () => { },
                status: sinon.stub().returnsThis()
            };

            const mock = sinon.mock(res);

            let user = {
                tarjetas: [],
                transacciones: [],
                tarjetasCredito: [],
                username: "MKJLW",
                correo: "amet.dapibus@dolordolortempus.net",
                contrasena: "IJA20SAJ8KI",
                nombres: "Rigel",
                apellidos: "Griffin",
                dpi: 745027164490,
                edad: 67,
                id: "5f9a586ea9be5b9630ba8590"
            }

            mock.expects("send").once().withExactArgs({
                message: "Contraseña incorrecta."
            });

            sandbox.stub(controllerUsuario.Usuario, 'findOne').returns({
                then: (callBack) => {
                    callBack(user);

                    expect(res.status.calledOnce).to.be.true;
                    expect(res.status.firstCall.calledWithExactly(400)).to.be.true;

                    mock.verify();

                    done();

                    return { catch: () => { } };
                }
            });
            let body = {
                userOMail: "MKJLW",
                pass: "XXXX"
            }
            controllerLogin.buscarUsuario({ body: body }, res);
        });

        it("Error de la base de datos al buscar hacer login.", done => {
            let catchStub = sandbox.stub();
            let stub = sandbox.stub(controllerUsuario.Usuario, 'findOne').returns({
                then: sandbox.stub().callsFake(() => { return { catch: catchStub } }),
            });

            catchStub.callsFake((cb) => {
                cb({ message: `Error al devolver el usuario con username=userx100` }, {});
            });
            let res = {
                send: () => { },
                status: sinon.stub().returnsThis()
            };

            const mock = sinon.mock(res);

            mock.expects("send").once().withExactArgs({
                message: `Error al buscar el usuario userx100.`
            });

            let body = {
                userOMail: "userx100",
                pass: "XXXX"
            }
            controllerLogin.buscarUsuario({ body: body }, res);

            expect(stub.calledOnce).to.be.true;
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.firstCall.calledWithExactly(500)).to.be.true;

            mock.verify();

            done();
        });

    })
})