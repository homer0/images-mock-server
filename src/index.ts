/* eslint-disable no-console */

import fastify from 'fastify';
import * as sharp from 'sharp';
import env from './env';

// -- Constants
const DEFAULT_PORT = 2506;
const PORT = env.port || DEFAULT_PORT;

// -- Fastify Server

const app = fastify({ logger: true });

// ---- Endpoints

app.get('/health', async (req, res) => res.send({ healthy: true }));

app.get('/test', async (req, res) => {
  const watermark = Buffer.from(`<svg>
    <rect x="0" y="0" width="500" height="100" fill="#000" />
    <text x="10" y="76" font-size="74" fill="#fff" font-family="monospace">Test</text>
  </svg>`);
  const image = await sharp({
    create: {
      width: 500,
      height: 500,
      channels: 4,
      background: { r: 90, g: 189, b: 28, alpha: 1 },
    },
  })
    .composite([{ input: watermark, gravity: 'southeast' }])
    .png()
    .toBuffer();

  res.header('Content-Type', 'image/png').send(image);
});

// -- Run Fastify

app.listen(PORT, (err, address) => {
  if (err) throw err;
  console.log(`DB server is now listening on ${address}`);
});
