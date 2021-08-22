type RGB = { r: number; g: number; b: number };
export const hexToRgb = (hex: string): RGB | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const getRandom = <T>(list: T[]): T =>
  list[Math.floor(Math.random() * list.length)];

type CreateMarkerOptions = {
  width: number;
  height: number;
  backgroundColor?: string;
  logSvg?: boolean;
};

export const createMarker = ({
  width,
  height,
  backgroundColor = '#000',
  logSvg = false,
}: CreateMarkerOptions): Buffer => {
  const svg = `
    <svg>
      <rect
        x="0"
        y="0"
        width="${width}"
        height="${height}"
        fill="${backgroundColor}"
      />
    </svg>
  `;

  if (logSvg) {
    // eslint-disable-next-line no-console
    console.log(svg);
  }

  return Buffer.from(svg);
};

type CreateLabelOptions = {
  imageWidth: number;
  imageHeight: number;
  caption: string;
  backgroundColor?: string;
  textColor?: string;
  logSvg?: boolean;
};

export const createLabel = ({
  imageWidth,
  imageHeight,
  caption,
  backgroundColor = '#000',
  textColor = '#fff',
  logSvg = false,
}: CreateLabelOptions): Buffer => {
  const height = Math.floor(imageHeight * 0.05);
  const textX = Math.floor(imageWidth * 0.02);
  const textY = Math.floor(height * 0.7);

  const svg = `
    <svg>
      <rect
        x="0"
        y="0"
        width="${imageWidth}"
        height="${height}"
        fill="${backgroundColor}"
      />
      <text
        x="${textX}"
        y="${textY}"
        font-size="${textY}"
        fill="${textColor}"
        font-family="monospace"
      >${caption}</text>
    </svg>
  `;

  if (logSvg) {
    // eslint-disable-next-line no-console
    console.log(svg);
  }

  return Buffer.from(svg);
};
