require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'please_change_me';

// helper middleware
function auth(required=true){
  return async (req, res, next) => {
    const header = req.headers.authorization;
    if(!header){
      if(required) return res.status(401).json({ error: 'Missing Authorization header' });
      req.user = null; return next();
    }
    const token = header.replace('Bearer ', '');
    try{
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await prisma.employee.findUnique({ where: { id: decoded.sub }});
      if(!req.user) return res.status(401).json({ error: 'User not found' });
      next();
    }catch(e){
      return res.status(401).json({ error: 'Invalid token' });
    }
  }
}

// Health
app.get('/', (req, res) => res.send('Time Tracker API'));

// Auth: signup (admin can create employees through employees route too)
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password, role } = req.body;
  if(!email || !password || !name) return res.status(400).json({ error: 'name, email, password required' });
  const hashed = await bcrypt.hash(password, 10);
  try{
    const user = await prisma.employee.create({
      data: { name, email, password: hashed, role: role || 'user' }
    });
    res.json({ id: user.id, email: user.email, name: user.name });
  }catch(e){
    res.status(400).json({ error: 'Email may already be used' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if(!email || !password) return res.status(400).json({ error: 'email and password required' });
  const user = await prisma.employee.findUnique({ where: { email }});
  if(!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if(!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role }});
});

// Employees CRUD (admin-only for create/update/delete)
app.get('/api/employees', auth(false), async (req, res) => {
  const users = await prisma.employee.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true }});
  res.json(users);
});

app.post('/api/employees', auth(true), async (req, res) => {
  // only admin can create
  if(!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'admin only' });
  const { name, email, password, role } = req.body;
  const hashed = await bcrypt.hash(password || 'changeme', 10);
  try{
    const user = await prisma.employee.create({ data: { name, email, password: hashed, role: role || 'user' }});
    res.json({ id: user.id, email: user.email, name: user.name });
  }catch(e){
    res.status(400).json({ error: 'Could not create employee' });
  }
});

app.put('/api/employees/:id', auth(true), async (req, res) => {
  if(!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'admin only' });
  const id = parseInt(req.params.id,10);
  const { name, email, role } = req.body;
  const updated = await prisma.employee.update({ where: { id }, data: { name, email, role }});
  res.json({ id: updated.id, name: updated.name, email: updated.email, role: updated.role });
});

app.delete('/api/employees/:id', auth(true), async (req, res) => {
  if(!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'admin only' });
  const id = parseInt(req.params.id,10);
  await prisma.employee.delete({ where: { id }});
  res.json({ success: true });
});

// Categories (simple strings, admin manages)
app.get('/api/categories', auth(false), async (req, res) => {
  const cats = await prisma.category.findMany();
  res.json(cats);
});
app.post('/api/categories', auth(true), async (req, res) => {
  if(!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'admin only' });
  const { name } = req.body;
  const c = await prisma.category.create({ data: { name }});
  res.json(c);
});

// Time entries
app.post('/api/entries', auth(true), async (req, res) => {
  // any authenticated user can create for themselves; admins can create for any employee
  const { employeeId, clockIn, clockOut, categoryId, notes, lat, lng } = req.body;
  let targetEmployee = req.user && req.user.role === 'admin' && employeeId ? employeeId : req.user.id;
  if(!targetEmployee) return res.status(400).json({ error: 'employeeId required' });
  const e = await prisma.timeEntry.create({
    data: {
      employeeId: targetEmployee,
      clockIn: clockIn ? new Date(clockIn) : new Date(),
      clockOut: clockOut ? new Date(clockOut) : null,
      activity: notes || '',
      notes: notes || '',
      categoryId: categoryId || null,
      lat: lat ? String(lat) : null,
      lng: lng ? String(lng) : null
    }
  });
  res.json(e);
});

app.get('/api/entries', auth(false), async (req, res) => {
  // simple query: optionally filter ?employeeId= &from= &to=
  const { employeeId, from, to } = req.query;
  const where = {};
  if(employeeId) where.employeeId = Number(employeeId);
  if(from || to) where.clockIn = {};
  if(from) where.clockIn.gte = new Date(from);
  if(to) where.clockIn.lte = new Date(to);
  const entries = await prisma.timeEntry.findMany({ where, include: { employee: { select: { id: true, name: true }}, category: true }, orderBy: { clockIn: 'desc' }});
  res.json(entries);
});

// Start
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Backend listening on http://localhost:${port}`));
