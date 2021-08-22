/* eslint-disable no-magic-numbers */
import * as path from 'path';
import fastify from 'fastify';
import * as sharp from 'sharp';
import env from './env';

// -- Constants
const DEFAULT_PORT = 2506;
const PORT = env.port || DEFAULT_PORT;
const COLORS = [
  '#006b73',
  '#fff638',
  '#b144f3',
  '#00e74e',
  '#7f00ae',
  '#28d53f',
  '#ac68ff',
  '#003800',
  '#b0009e',
  '#00ffff',
  '#ad0000',
  '#00ffff',
  '#ff712c',
  '#003fb5',
  '#12b790',
  '#920020',
  '#00f2ff',
  '#700000',
  '#007795',
  '#640000',
  '#ffb0ff',
  '#414500',
  '#ff8fcc',
  '#313600',
  '#003456',
  '#535000',
  '#003751',
  '#700014',
  '#195447',
  '#600200',
]
  .map((hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  })
  .filter((color) => color);

// -- Basic utilities

const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

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

    const svg = `
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

    const lbl = Buffer.from(svg);
    const color = getRandomColor();

    const image = await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { ...color, alpha: 1 },
      },
    })
      .composite([{ input: lbl, gravity: 'southeast' }])
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
