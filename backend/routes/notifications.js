const express = require('express');
const router = express.Router();

// Simulated notification data (replace with your logic, e.g., database triggers)
const notifications = [];
let clients = [];

router.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Store the client connection
  const clientId = Date.now();
  clients.push({ id: clientId, res });

  // Send initial notifications
  notifications.forEach((notification) => {
    res.write(`data: ${JSON.stringify(notification)}\n\n`);
  });

  // Cleanup on client disconnect
  req.on('close', () => {
    clients = clients.filter((client) => client.id !== clientId);
  });
});

// Simulate adding a new notification (e.g., triggered by user creation or order)
function sendNotification(message) {
  const notification = { id: Date.now(), message, timestamp: new Date().toISOString() };
  notifications.push(notification);

  // Broadcast to all connected clients
  clients.forEach((client) => {
    client.res.write(`data: ${JSON.stringify(notification)}\n\n`);
  });
}

// Example: Trigger a notification (e.g., from auth.js when a user is created)
module.exports = { router, sendNotification };