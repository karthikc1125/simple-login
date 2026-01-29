/**
 * Express app setup. Configures middleware, routes, and app-level settings.
 */

import express from 'express';

const app = express();

// Middleware and routes will be configured here
app.use(express.json());

export default app;
