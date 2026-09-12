import { createApp } from './app.js';
import { ENV } from './config/env.js';

const app = createApp();

const server = app.listen(ENV.PORT, () => {
  console.log(`⚔️  Life RPG Engine listening on port ${ENV.PORT} [${ENV.NODE_ENV}]`);
  console.log(`🛡️  Health check available at http://localhost:${ENV.PORT}/api/health`);
});

// Graceful shutdown
const handleShutdown = () => {
  console.log('Shutting down Life RPG Engine...');
  server.close(() => {
    console.log('Server closed successfully.');
    process.exit(0);
  });
};

process.on('SIGTERM', handleShutdown);
process.on('SIGINT', handleShutdown);
