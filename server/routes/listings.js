const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

router.get('/', (req, res) => {
  const { q, brand, condition, maxPrice } = req.query;
  let results = db.listings.filter(l => l.status === 'active');
  if (q) results = results.filter(l => l.title.toLowerCase().includes(q.toLowerCase()) || l.brand.toLowerCase().includes(q.toLowerCase()));
  if (brand && brand !== 'All') results = results.filter(l => l.brand === brand);
  if (condition && condition !== 'All') results = results.filter(l => l.condition === condition);
  if (maxPrice) results = results.filter(l => l.price <= Number(maxPrice));
  results = results.map(l => {
    const seller = db.users.find(u => u.id === l.seller_id);
    return { ...l, seller_name: seller?.name || 'Unknown', seller_email: seller?.email || '' };
  });
  res.json(results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
});

router.get('/mine', requireAuth, (req, res) => {
  const mine = db.listings.filter(l => l.seller_id === req.session.userId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(mine);
});

router.get('/:id', (req, res) => {
  const listing = db.listings.find(l => l.id === Number(req.params.id));
  if (!listing) return res.status(404).json({ error: 'Not found' });
  listing.views++;
  const seller = db.users.find(u => u.id === listing.seller_id);
  res.json({ ...listing, seller_name: seller?.name, seller_email: seller?.email, seller_id: listing.seller_id });
});

router.post('/', requireAuth, (req, res) => {
  const { title, brand, model, price, condition, storage, color, description, location, image } = req.body;
  const fields = {};
  const amount = Number(price);

  if (!title?.trim()) fields.title = 'Listing title is required';
  if (!brand?.trim()) fields.brand = 'Brand is required';
  if (!condition?.trim()) fields.condition = 'Condition is required';
  if (price === undefined || price === '') fields.price = 'Price is required';
  else if (!Number.isFinite(amount) || amount <= 0) fields.price = 'Price must be greater than 0';
  if (image && (!/^data:image\/(png|jpe?g|webp);base64,/.test(image) || image.length > 35_000_000)) {
    fields.image = 'Image is too large. Choose a photo under 25MB.';
  }

  if (Object.keys(fields).length) {
    return res.status(400).json({ error: 'Please fix the highlighted fields', fields });
  }

  const listing = {
    id: db.nextId.listings++, title: title.trim(), brand, model: model || '', price: amount,
    condition, storage: storage || '', color: color || '', description: description || '',
    location: location || '', status: 'active', views: 0,
    seller_id: req.session.userId, image: image || null, created_at: new Date()
  };
  db.listings.push(listing);
  res.status(201).json(listing);
});

router.put('/:id', requireAuth, (req, res) => {
  const listing = db.listings.find(l => l.id === Number(req.params.id));
  if (!listing) return res.status(404).json({ error: 'Not found' });
  if (listing.seller_id !== req.session.userId) return res.status(403).json({ error: 'Not authorized' });

  const { title, brand, model, price, condition, storage, color, description, location, image } = req.body;
  const fields = {};
  const amount = Number(price);

  if (!title?.trim()) fields.title = 'Listing title is required';
  if (!brand?.trim()) fields.brand = 'Brand is required';
  if (!condition?.trim()) fields.condition = 'Condition is required';
  if (price === undefined || price === '') fields.price = 'Price is required';
  else if (!Number.isFinite(amount) || amount <= 0) fields.price = 'Price must be greater than 0';
  if (image && (!/^data:image\/(png|jpe?g|webp);base64,/.test(image) || image.length > 35_000_000)) {
    fields.image = 'Image is too large. Choose a photo under 25MB.';
  }

  if (Object.keys(fields).length) {
    return res.status(400).json({ error: 'Please fix the highlighted fields', fields });
  }

  Object.assign(listing, {
    title: title.trim(), brand, model: model || '', price: amount,
    condition, storage: storage || '', color: color || '', description: description || '',
    location: location || '', image: image || null, updated_at: new Date()
  });
  res.json(listing);
});

router.delete('/:id', requireAuth, (req, res) => {
  const idx = db.listings.findIndex(l => l.id === Number(req.params.id) && l.seller_id === req.session.userId);
  if (idx === -1) return res.status(403).json({ error: 'Not authorized' });
  db.listings.splice(idx, 1);
  res.json({ message: 'Deleted' });
});

module.exports = router;
