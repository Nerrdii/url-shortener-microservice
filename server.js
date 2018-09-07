const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');

const config = require('./config/keys');

require('./models/Url');
const Url = mongoose.model('urls');

const app = express();

mongoose.connect(
  config.mongoURI,
  { useNewUrlParser: true }
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ optionsSuccessStatus: 200 }));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/api/shorturl/:id', async (req, res) => {
  const id = req.params['id'];

  try {
    const existingUrl = await Url.find({ id });

    if (existingUrl) {
      res.redirect(existingUrl.originalUrl);
    }
  } catch (err) {
    res.json({
      error: 'short url does not exist'
    });
  }
});

app.post('/api/shorturl/new', async (req, res) => {
  const urlBody = req.body['url'];

  const validUrl = isValidUrl(urlBody);
  const validDns = await isValidDns(urlBody);

  if (!validUrl || !validDns) {
    res.send({
      error: 'invalid URL'
    });
  }

  const existingUrl = await Url.findOne({ originalUrl: urlBody });

  if (existingUrl) {
    res.json({
      original_url: existingUrl.originalUrl,
      short_url: existingUrl._id
    });
  } else {
    const url = await new Url({ originalUrl: urlBody }).save();
    res.json({ original_url: url.originalUrl, short_url: url._id });
  }
});

function isValidUrl(url) {
  const urlRegex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return urlRegex.test(url);
}

function isValidDns(url) {
  return new Promise((resolve, reject) => {
    dns.lookup(url, err => {
      if (err) {
        reject(err);
      }

      resolve();
    });
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`App now listening on port ${PORT}...`));
