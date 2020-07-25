const express = require("express");
const router = express.Router();
var path = require('path');

router.get("/", (req, res) => {
  //res.send({ response: "I am alive" }).status(200);
  res.sendFile(path.join(__dirname + '/index.html'))
});

module.exports = router;