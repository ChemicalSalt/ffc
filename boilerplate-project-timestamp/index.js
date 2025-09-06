const express = require('express');
const cors = require('cors');
const app = express();

// enable CORS for FCC testing
app.use(cors({ optionsSuccessStatus: 200 }));

// serve static files
app.use(express.static('public'));

// root route
app.get("/", (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// example API endpoint
app.get("/api/hello", (req, res) => {
  res.json({ greeting: 'hello API' });
});

// timestamp microservice
app.get('/api/:date?', (req, res) => {
  let dateString = req.params.date;
  let date;

  if (!dateString) {
    date = new Date();
  } else if (!isNaN(Number(dateString))) {
    date = new Date(parseInt(dateString));
  } else {
    date = new Date(dateString);
  }

  if (date.toString() === "Invalid Date") {
    return res.json({ error: "Invalid Date" });
  }

  res.json({
    unix: date.getTime(),
    utc: date.toUTCString()
  });
});

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
