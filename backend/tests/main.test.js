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
                    expect(result.body).to.be.a("object")
                    expect(result.body.message).to.equal("El usuario se creo correctamente.");
                    done();
                });
        });
    });
});