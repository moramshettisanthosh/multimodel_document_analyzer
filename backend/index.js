require('dotenv').config();
// Global handlers to prevent worker-thread errors from crashing the server during development
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err && err.stack ? err.stack : err);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason && reason.stack ? reason.stack : reason);
});

const app = require('./src/app');
const PORT = process.env.PORT || 4000;
const fs = require('fs');
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const server = app.listen(PORT, () => {
  console.log(`AuroraDocs backend running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} already in use. Another process may be running.`);
    // Exit gracefully so the developer can inspect/kill the other process
    process.exit(1);
  }
  console.error('Server error:', err && err.stack ? err.stack : err);
});
