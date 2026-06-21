const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, (req, res) => {
  const userId = req.session.userId;
  const msgs = db.messages
    .filter(m => m.sender_id === userId || m.recipient_id === userId)
    .map(m => {
      const sender = db.users.find(u => u.id === m.sender_id);
      const recipient = db.users.find(u => u.id === m.recipient_id);
      const listing = db.listings.find(l => l.id === m.listing_id);
      return { ...m, sender_name: sender?.name, recipient_name: recipient?.name, listing_title: listing?.title };
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(msgs);
});

router.post('/', requireAuth, (req, res) => {
  const { listing_id, recipient_id, content } = req.body;
  if (!listing_id || !recipient_id || !content) return res.status(400).json({ error: 'Missing fields' });
  const msg = {
    id: db.nextId.messages++, listing_id: Number(listing_id),
    sender_id: req.session.userId, recipient_id: Number(recipient_id),
    content, read: false, created_at: new Date()
  };
  db.messages.push(msg);
  res.status(201).json(msg);
});

module.exports = router;
