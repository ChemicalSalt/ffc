require('dotenv').config();
let express = require('express');
let app = express();

// Root-level logger middleware
app.use((req, res, next) => {
  console.log(req.method + " " + req.path + " - " + req.ip);
  next();
});

app.use("/public", express.static(__dirname + "/public"));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/json", (req, res) => {
  let msg = "Hello json";                 
  if (process.env.MESSAGE_STYLE === "uppercase") 
    msg = msg.toUpperCase();            
  res.json({ message: msg });          
});

app.get("/now", 
  function(req, res, next) {
    req.time = new Date().toString(); 
    next();
  }, 
  function(req, res) {
    res.json({ time: req.time });
  }
);
app.get("/:word/echo", (req, res) => {
  res.json({ echo: req.params.word });
});

module.exports = app;
