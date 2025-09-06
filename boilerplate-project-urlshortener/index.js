require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const dns = require('dns');
const { URL } = require('url');
let urls = [];        
let nextShortUrl = 1;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  const original_url = req.body.url;

  // Validate URL syntax
  let parsedUrl;
  try {
    parsedUrl = new URL(original_url);
  } catch (err) {
    return res.json({ error: 'invalid url' });
  }

  // Check if domain exists
  dns.lookup(parsedUrl.hostname, (err, address) => {
    if (err) return res.json({ error: 'invalid url' });

    // If already shortened, return existing entry
    let found = urls.find(u => u.original_url === original_url);
    if (found) return res.json(found);

    // Save new URL
    const newUrl = { original_url, short_url: nextShortUrl++ };
    urls.push(newUrl);

    res.json(newUrl);
  });
});

app.get('/api/shorturl/:id', (req, res) => {
  const shortUrlId = Number(req.params.id);
  const urlEntry = urls.find(u => u.short_url === shortUrlId);

  if (!urlEntry) return res.json({ error: 'invalid url' });

  res.redirect(urlEntry.original_url);
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});