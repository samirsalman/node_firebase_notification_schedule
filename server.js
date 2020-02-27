//Let's include the module to work with HTTP
const http = require("http");

//Let's include the module to work with the FILESYSTEM
const fs = require("fs");

//Let's include the module to create quicky our  server
const express = require("express");
const app = express();

//define the port on which the server will listen
const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log(`I'm listening on port : `, PORT);
});

//include this module and use it to autogenerate documentation for our server (app)
const Docs = require("express-api-doc");
const docs = new Docs(app);

/*Let's include the module that enable the backend to receive and send http request
not simple (example http request with json in the body)*/
var cors = require("cors");
app.use(cors());

/*Let's include the module that enable the backend to parse the json received in the
body of the http request*/
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*Let's define the other routes to access to our server*/
const newsRoute = require("./api/routes/news");
app.use("/news", newsRoute);
