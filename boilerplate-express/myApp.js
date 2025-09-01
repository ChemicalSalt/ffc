require('dotenv').config();
let express = require('express');
let app = express();

app.use("/public", express.static(__dirname + "/public"));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/views/index.html");
});

// Serve JSON at /json
app.get("/json", (req, res) => {
  let msg = "Hello json";                 
  if (process.env.MESSAGE_STYLE === "uppercase") 
    msg = msg.toUpperCase();            
  res.json({ message: msg });          
});


module.exports = app;
