const request = require('supertest');
const api = require('../index');
const app = api.app;

describe('GET /', function() {
    it('/ responde con API FUNCIONANDO CORRECTAMENTE V2', done => {
        request(app).get('/').expect('API FUNCIONANDO CORRECTAMENTE V2');
        done();
    });
});