const request = require('supertest');
const api = require('../index');

const app = api.app;

const usersRoute = "/api/usuario";

const { expect } = require('chai');

const CorrectUserInfo = {
    username: "edgar",
    correo: "edgar@usac.com",
    contrasena: "1234",
    nombres: "edgar arnoldo",
    apellidos: "aldana arriola",
    dpi: 303035343831,
    edad: 25,
};

const IncorrectUserInfo = {
    username: "edgar",
    correo: "edgar@usac.com",
    contrasena: "1234",
    nombres: "edgar arnoldo",
    edad: 25,
};

const UserInfoUpdate = {
    username: "edgar",
    correo: "edgar2@usac.com",
    contrasena: "1234",
    nombres: "edgar arnoldo",
    apellidos: "aldana arriola",
    dpi: 303035343831,
    edad: 26,
};
describe('GET /', function() {
    it('/ responde con API FUNCIONANDO CORRECTAMENTE V2', done => {
        request(app).get('/').end(function(error, result) {
            if (error) {
                console.log("ERROR: ");
                console.log(error);
            }

            expect(result.text).to.equal("API y MongoDB funcionando correctamente");

            done();
        });
    });
});

describe('Historia: Registrar Usuarios', () => {
    describe('POST /', () => {
        it("Guardar un usuario con datos correctos", done => {
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
        });
    });
    describe('PUT /', () => {
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
    });
});