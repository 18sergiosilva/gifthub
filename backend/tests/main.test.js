const chai = require('chai');
const faker = require('faker');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

process.env.TESTING = true;

const api = require('../index');
const controllerUsuario = require('../app/controllers/usuario');
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

const testProduct = {
    id: "0",
    nombre: faker.commerce.product(),
    vendedor: `${faker.name.firstName()} ${faker.name.lastName()}`,
    precio: faker.random.number({ min: 1000, max: 10000, precision: 2 }) / 100,
    descripcion: faker.commerce.productDescription()
};

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
                then: (data) => {
                        data();

                        mock.verify();
                    }
                    //sandbox.stub().callsFake(() => { return { catch: catchStub } }),
            });

            controllerUsuario.create({ body: CorrectUserInfo }, res);

            done();
        });
        /*
                it("Guardar un usuario con datos correctos1111111111", done => {
                    request(app)
                        .post('/usuario')
                        .send(CorrectUserInfo)
                        .end(function(error, result) {
                            //expect(result).to.have.status(200);
                            expect(result.body).to.be.a("object")
                            expect(result.body.message).to.equal("El usuario se creo correctamente.");
                            done();
                        });
                });
                it("Intentar guardar un usuario con datos incorrectos", done => {
                    request(app)
                        .post('/usuario')
                        .send(IncorrectUserInfo)
                        .end(function(error, result) {
                            //expect(result).to.have.status(500);
                            expect(result.body).to.be.a("object")
                            expect(result.body.message).to.equal("Los datos enviados de usuario son incorrectos.");
                            done();
                        });
                });*/
    });
    /* describe('PUT /', () => {
        it("Actualiar un usuario existente", done => {
            request(app)
                .put('/usuario/edgar')
                .send(UserInfoUpdate)
                .end(function(error, result) {
                    //expect(res).to.have.status(200);
                    expect(result.body).to.be.a("object")
                    expect(result.body.message).to.equal("Usuario actualizado correctamente.");
                    done();
                });
        });
        it("Error al actualizar un usuario que no existe", done => {
            request(app)
                .put('/usuario/edgar2')
                .send(UserInfoUpdate)
                .end(function(error, result) {
                    //expect(res).to.have.status(404);
                    expect(result.body).to.be.a("object")
                    expect(result.body.message).to.equal("¡No se encontro el usuario!");
                    done();
                });
        });
        it("Error al actualizar un usuario sin enviar datos para actaulizar", done => {
            request(app)
                .put('/usuario/edgar')
                .end(function(error, result) {
                    //expect(res).to.have.status(404);
                    expect(result.body).to.be.a("object")
                    expect(result.body.message).to.equal("Los datos a modificar no deben de esta vacios.");
                    done();
                });
        });
    });
    describe('Get /', () => {
        it("Buscar un usuario existente", done => {
            request(app)
                .get('/usuario/edgar')
                .end(function(error, result) {
                    //expect(res).to.have.status(200);
                    expect(result.body).to.be.a("object")
                    expect(result.body.message).to.equal("Usuario encontrado.");
                    expect(result.body.usuario.username).to.equal("edgar");
                    done();
                });
        });
        it("Buscar un usuario que no existente", done => {
            request(app)
                .get('/usuario/edgar4')
                .end(function(error, result) {
                    //expect(res).to.have.status(404);
                    expect(result.body).to.be.a("object")
                    expect(result.body.message).to.equal("Usuario con username=edgar4 no encontrado.");
                    done();
                });
        });
    });
*/
});