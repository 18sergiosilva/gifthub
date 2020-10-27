const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./app/models");
const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// Entry
app.get('/', function(req, res) {
    res.send('API y MongoDB funcionando correctamente');
});

require("./app/routes/usuario")(app);
require("./app/routes/cards")(app);
require("./app/routes/compra")(app);

const dbConnect = (url) => {
    db.mongoose
        .connect(url)
        .catch(err => {
            console.error("** No se pudo conectar a la base de datos **");
            console.error(err);
            process.exit();
        });
};

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
    api.dbConnect(process.env.TESTING ? db.testUrl : db.url);
});

let api = { server: server, app: app, dbConnect: dbConnect };

module.exports = api;