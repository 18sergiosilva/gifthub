module.exports = app => {
    const producto = require("../controllers/login");

    var router = require("express").Router();

    // Login
    router.post("/", producto.findOne);

};