import fastify from 'fastify';
import * as sharp from 'sharp';
import { COLORS, PORT } from './config';
import { createLabel, createMarker, getRandom } from './fns';

// -- Fastify Server

const app = fastify({ logger: true });

// ---- Endpoints

// ----=== (Dummy) health endpoint
app.get('/health', async (req, res) => res.send({ healthy: true }));

// ----=== Image generation
app.get<{ Params: { width: string; height: string; filename: string } }>(
  '/:width/:height/:filename',
  async (req, res) => {
    const width = Number(req.params.width);
    if (Number.isNaN(width)) {
      throw new Error('Invalid width');
    }
    const height = Number(req.params.height);
    if (Number.isNaN(height)) {
      throw new Error('Invalid height');
    }

    const color = getRandom(COLORS);
    const markerWidth = Math.floor(width * 0.05);
    const markerHeight = Math.floor(height * 0.1);

    const label = createLabel({
      imageWidth: width,
      imageHeight: height,
      caption: req.params.filename,
    });
    const sideMarker = createMarker({
      width: markerWidth,
      height: markerHeight,
    });
    const topMarker = createMarker({
      width: markerHeight,
      height: markerWidth,
    });

    const image = await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { ...color, alpha: 1 },
      },
    })
      .composite([
        {
          input: sideMarker,
          gravity: 'west',
        },
        {
          input: sideMarker,
          gravity: 'east',
        },
        { input: topMarker, gravity: 'north' },
        {
          input: label,
          gravity: 'southeast',
        },
      ])
      .png()
      .toBuffer();

    res
      .header('Content-Type', 'image/png')
      .header('Content-Length', image.length)
      .send(image);
  },
);

// -- Run Fastify

app.listen(PORT, (err, address) => {
  if (err) throw err;
  // eslint-disable-next-line no-console
  console.log(`DB server is now listening on ${address}`);
});
