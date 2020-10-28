const chai = require('chai');
const sinon = require('sinon');

const { expect } = chai;
process.env.TESTING = true;

var sandbox;
beforeEach(function() {
    sandbox = sinon.createSandbox();
});

afterEach(function() {
    sandbox.restore();
});

const res = {
    send: () => {},
    status: sinon.stub().returnsThis()
};

describe('Regalar GiftCards', () => {
    it('Buscar un usuario en la base de datos', (done) => {
        done()
    });
    
    it('Retornar indefinido si el usuario no es encontrado', (done) => {
        done()
    });
    
    it('El usuario que regala es retornado con exito', (done) => {
        done()
    });
    
    it('Si la nueva cantidad es menor que cero, retorna un mensaje de cantidad insuficiente', (done) => {
        done()
    });
    
    it('Si no existe la tarjeta en el inventario del usuario que regala, devuelve un error', (done) => {
        done()
    });
   
    it('Agregar al usuario que le regalan la cantidad nueva de una tarjeta', (done) => {
        done()
    });

    it('Agregar a las tarjetas del usuario una tarjeta nueva que le es regalada', (done) => {
        done()
    });

    it('Actualizar usuario devuelve datos del usuario de manera correcta', (done) => {
        done()
    });

    it('Actualizar usuario devuelve un mensaje de error cuando hay un error modificandolo', (done) => {
        done()
    });
    
    it('Regalar giftcard devuelve error si hay datos faltantes', (done) => {
        done()
    });
    
    it('Si no se encuentra el usuario que regala devuelve un error 404', (done) => {
        done()
    });
    
    it('Si no se encuentra el usuario al que regalan devuelve un error 404', (done) => {
        done()
    });

    it('Si hay un error modificando las tarjetas del usuario que regala devuelve un error 400', (done) => {
        done()
    });
    
    it('Si hay un error modificando las tarjetas del usuario al que regalan devuelve un error 400', (done) => {
        done()
    });

    it('Devuelve un codigo 200 si las tarjetas fueron regaladas con exito', (done) => {
        done()
    });
});




