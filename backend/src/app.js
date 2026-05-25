const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const docRoutes = require('./routes/documents');
const chatRoutes = require('./routes/chat');
const errorHandler = require('./middleware/errorHandler');

require('dotenv').config();

const app = express();
connectDB();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/documents', docRoutes);
app.use('/api/chat', chatRoutes);

// Serve frontend if built into ../frontend/dist — enables single-host testing
const frontDist = path.join(__dirname, '..', '..', 'frontend', 'dist');
if (fs.existsSync(frontDist)) {
	app.use(express.static(frontDist));
	app.get('*', (req, res, next) => {
		// Let API routes respond as usual
		if (req.path.startsWith('/api/')) return next();
		res.sendFile(path.join(frontDist, 'index.html'));
	});
}

app.use(errorHandler);

module.exports = app;
