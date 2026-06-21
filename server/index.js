const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      error: 'Image is too large. Choose a smaller photo.',
      fields: { image: 'Image is too large. Choose a smaller photo.' }
    });
  }
  next(err);
});
app.use(session({
  secret: 'recell_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/listings', require('./routes/listings'));
app.use('/api/messages', require('./routes/messages'));

app.get('/pages/browse', (req, res) => {
  const db = require('./db');
  const listings = db.listings
    .filter(l => l.status === 'active')
    .map(l => ({ ...l, seller_name: db.users.find(u => u.id === l.seller_id)?.name }));
  res.render('browse', { listings });
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`📡 API at http://localhost:${PORT}/api`);
  console.log(`🗂  EJS page at http://localhost:${PORT}/pages/browse\n`);
});
