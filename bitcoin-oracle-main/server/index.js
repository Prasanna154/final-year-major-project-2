import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const USERS_FILE = path.join(__dirname, 'users.json');
const PREDICTIONS_FILE = path.join(__dirname, 'predictions.json');

// Helper to read JSON
const readData = (file) => {
  try {
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// Helper to write JSON
const writeData = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

// Auth: Signup
app.post('/api/auth/signup', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const users = readData(USERS_FILE);
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const newUser = { id: Date.now().toString(), email, password };
  users.push(newUser);
  writeData(USERS_FILE, users);

  res.status(201).json({ message: 'User created successfully', user: { id: newUser.id, email } });
});

// Auth: Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const users = readData(USERS_FILE);
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Simple token simulation
  res.json({ message: 'Login successful', token: `fake-jwt-token-${user.id}`, user: { id: user.id, email } });
});

// Auth: Reset Password
app.post('/api/auth/reset', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and new password required' });

  const users = readData(USERS_FILE);
  const userIndex = users.findIndex(u => u.email === email);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  users[userIndex].password = password;
  writeData(USERS_FILE, users);

  res.json({ message: 'Password reset successfully' });
});

// Predictions: Save
app.post('/api/predictions', (req, res) => {
  const { userId, data } = req.body;
  if (!userId || !data) return res.status(400).json({ error: 'User ID and prediction data required' });

  const predictions = readData(PREDICTIONS_FILE);
  const newPrediction = { id: Date.now().toString(), userId, data, createdAt: new Date().toISOString() };
  predictions.push(newPrediction);
  writeData(PREDICTIONS_FILE, predictions);

  res.status(201).json({ message: 'Prediction saved', prediction: newPrediction });
});

// Predictions: Get Last
app.get('/api/predictions/:userId', (req, res) => {
  const { userId } = req.params;
  const predictions = readData(PREDICTIONS_FILE);
  
  // Get latest prediction for user
  const userPredictions = predictions.filter(p => p.userId === userId);
  if (userPredictions.length === 0) {
    return res.json(null);
  }
  
  const latest = userPredictions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  res.json(latest.data);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`API Server running on http://localhost:${PORT}`));
