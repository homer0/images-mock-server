import * as path from 'path';
import fastify from 'fastify';
import * as sharp from 'sharp';
import { COLORS, PORT } from './config';
import { getRandom } from './fns';

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

    const fileinfo = path.parse(req.params.filename);
    const lblHeight = Math.floor(height * 0.05);
    const lblTextX = Math.floor(width * 0.02);
    const lblTextY = Math.floor(lblHeight * 0.7);

    const lblSvg = `
      <svg>
        <rect
          x="0"
          y="0"
          width="${width}"
          height="${lblHeight}"
          fill="#000"
        />
        <text
          x="${lblTextX}"
          y="${lblTextY}"
          font-size="${lblTextY}"
          fill="#fff"
          font-family="monospace"
        >${fileinfo.base}</text>
      </svg>
    `;

    const lbl = Buffer.from(lblSvg);
    const color = getRandom(COLORS);

    const smWidth = Math.floor(width * 0.05);
    const smHeight = Math.floor(height * 0.1);
    const smSvg = `
      <svg>
        <rect
          x="0"
          y="0"
          width="${smWidth}"
          height="${smHeight}"
          fill="#000"
        />
      </svg>
    `;
    const lm = Buffer.from(smSvg);
    const rm = Buffer.from(smSvg);
    const tmSvg = `
      <svg>
        <rect
          x="0"
          y="0"
          width="${smHeight}"
          height="${smWidth}"
          fill="#000"
        />
      </svg>
    `;
    const tm = Buffer.from(tmSvg);

    const image = await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { ...color, alpha: 1 },
      },
    })
      .composite([
        { input: lm, gravity: 'west' },
        { input: rm, gravity: 'east' },
        { input: tm, gravity: 'north' },
        { input: lbl, gravity: 'southeast' },
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
