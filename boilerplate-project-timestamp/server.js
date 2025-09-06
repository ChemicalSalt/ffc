const express = require('express');
const app = express();

app.get('/api/:date?', (req, res) => {
  let dateString = req.params.date;
  let date;

  if (!dateString) {
    // No date → use current time
    date = new Date();
  } else if (!isNaN(Number(dateString))) {
    // If input is numbers only → treat as UNIX ms timestamp
    date = new Date(parseInt(dateString));
  } else {
    // Otherwise → try to parse as date string
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

// Use FCC test port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
