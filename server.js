var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var port = process.env.PORT || 3000;

/* routines */
app.use(
  require("morgan")("dev", {
    skip: function(req, res) {
      return (
        res.statusCode < 400
      ); /* || [400, 404, 401].indexOf(req.statusCode) */
    },
    stream: process.stdout
  })
);
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
app.use(require("method-override")());

app.use(require("./routes"));

/* error handlers */

app.use(function(req, res) {
  res.status(404).send({
    err: req.originalUrl + " not found"
  });
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.status(500).json({
    err: err.message
  });
  throw err;
});

app.listen(port);

console.log(`okapi RESTful API server started on: ${port}`);
