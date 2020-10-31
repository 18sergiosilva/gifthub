const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);


const db = {};
db.mongoose = mongoose;

db.url = dbConfig.url;
db.testUrl = dbConfig.testing;

db.usuario = require("./usuario")(mongoose);
db.transacciones = require("./transacciones")(mongoose);
db.cardsValueTasaCambio = require("./cardsValueTasaCambio")(mongoose);

// configuracion de la conexion a mongodb
db.mongoose.set('useNewUrlParser', true);
db.mongoose.set('useFindAndModify', false);
db.mongoose.set('useCreateIndex', true);
db.mongoose.set('useUnifiedTopology', true);

module.exports = db;