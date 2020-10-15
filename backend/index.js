const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./app/models");

const app = express();

app.use(cors());

// Conectar a la base de datos
db.mongoose
    .connect(process.env.TESTING ? db.testUrl : db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .catch(err => {
        console.log("No se pudo conectar a la base de datos", err);
        process.exit();
    });

// Entry
app.get('/', function (req, res) {
    res.send('API y MongoDB funcionando correctamente');
});

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
    console.log("Iniciando api en el puerto: " + port);
});

module.exports = { server: server, app: app };