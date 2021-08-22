import env from './env';
import { hexToRgb } from './fns';

export const PORT = env.port || 2506;
export const COLORS = [
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
  .map(hexToRgb)
  .filter(Boolean);
