const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());

//Entry
app.get('/', function (req, res) {
    res.send('API FUNCIONANDO CORRECTAMENTE V2');
});

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
    console.log("Iniciando api en el puerto: " + port);
});

module.exports = { server: server, app: app };