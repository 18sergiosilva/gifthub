const request = require('supertest');
const api = require('../index');

const app = api.app;

const { expect } = require('chai');

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