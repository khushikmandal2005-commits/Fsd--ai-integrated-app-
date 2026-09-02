require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Serve static HTML/CSS/JS files from root directory
app.use(express.static(__dirname));

// Primary Opening Route -> Serves Login Page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 ResuCoach AI Server is running on port ${PORT}`);
  console.log(`🌐 Opening Page: http://localhost:${PORT}`);
  console.log(`==================================================`);
});
