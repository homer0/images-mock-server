/* eslint-disable no-console */

import fastify from 'fastify';
import env from './env';

// -- Constants
const DEFAULT_PORT = 2506;
const PORT = env.port || DEFAULT_PORT;

// -- Fastify Server

const app = fastify({ logger: true });

// ---- Health

app.get('/health', async (req, res) => res.send({ healthy: true }));

// -- Run Fastify

app.listen(PORT, (err, address) => {
  if (err) throw err;
  console.log(`DB server is now listening on ${address}`);
});
