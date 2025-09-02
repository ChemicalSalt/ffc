require('dotenv').config();
let express = require('express');
let app = express();
let bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));

// Root-level logger middleware
app.use((req, res, next) => {
  console.log(req.method + " " + req.path + " - " + req.ip);
  next();
});

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/json", (req, res) => {
  let msg = "Hello json";                 
  if (process.env.MESSAGE_STYLE === "uppercase") 
    msg = msg.toUpperCase();            
  res.json({ message: msg });          
});

app.get("/now", 
  (req, res, next) => {
    req.time = new Date().toString(); 
    next();
  }, 
  (req, res) => {
    res.json({ time: req.time });
  }
);

app.get("/:word/echo", (req, res) => {
  res.json({ echo: req.params.word });
});

// Single route handler for GET and POST
app.route("/name")
  .get((req, res) => {
    let first = req.query.first;
    let last = req.query.last;
    res.json({ name: first + " " + last });
  })
  .post((req, res) => {
    let first = req.body.first;
    let last = req.body.last;
    res.json({ name: first + " " + last });
  });

module.exports = app;
