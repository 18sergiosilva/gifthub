const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(cors());

const server = app.listen(process.env.PORT || 5000, () => {

});

module.exports = { server: server, app: app };