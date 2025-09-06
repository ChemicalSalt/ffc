const express = require('express');
const app = express();

app.get('/api/timestamp/:date?', (req, res) => {
  let dateString = req.params.date;

  let date;
  if (!dateString) {
    date = new Date();
  } else if (!isNaN(dateString)) {
    // If it's a number, treat as UNIX timestamp
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

app.listen(3000, () => console.log("Server running on port 3000"));
