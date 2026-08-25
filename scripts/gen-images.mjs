// One-off generator for favicon/og-image PNGs. Not part of the build; run manually if assets need regeneration.
import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';

function crc32(buf) {
  let c;
  const table = crc32.table || (crc32.table = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })());
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function encodePNG(width, height, rgbaBuffer) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filter type none
    rgbaBuffer.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = deflateSync(raw, { level: 9 });

  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function setPixel(buf, width, x, y, r, g, b, a = 255) {
  x = Math.round(x); y = Math.round(y);
  if (x < 0 || y < 0 || x >= width) return;
  const idx = (y * width + x) * 4;
  if (idx < 0 || idx + 3 >= buf.length) return;
  buf[idx] = r; buf[idx + 1] = g; buf[idx + 2] = b; buf[idx + 3] = a;
}

function drawLine(buf, width, x0, y0, x1, y1, r, g, b, thickness = 1) {
  const dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
  const dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  let x = x0, y = y0;
  const half = Math.floor(thickness / 2);
  for (;;) {
    for (let ox = -half; ox <= half; ox++) {
      for (let oy = -half; oy <= half; oy++) {
        setPixel(buf, width, x + ox, y + oy, r, g, b);
      }
    }
    if (x === x1 && y === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x += sx; }
    if (e2 <= dx) { err += dx; y += sy; }
  }
}

function fillRoundedRect(buf, width, height, x0, y0, x1, y1, radius, r, g, b) {
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      if (x < 0 || y < 0 || x >= width || y >= height) continue;
      const inCornerZone =
        (x < x0 + radius && y < y0 + radius) ||
        (x >= x1 - radius && y < y0 + radius) ||
        (x < x0 + radius && y >= y1 - radius) ||
        (x >= x1 - radius && y >= y1 - radius);
      if (inCornerZone) {
        const cx = x < x0 + radius ? x0 + radius : x1 - radius;
        const cy = y < y0 + radius ? y0 + radius : y1 - radius;
        const dist = Math.hypot(x - cx, y - cy);
        if (dist > radius) continue;
      }
      setPixel(buf, width, x, y, r, g, b);
    }
  }
}

function makeGraphic(width, height, { curveColor, tangentColor, dotColor, bg, margin }) {
  const buf = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    buf[i * 4] = bg[0]; buf[i * 4 + 1] = bg[1]; buf[i * 4 + 2] = bg[2]; buf[i * 4 + 3] = 255;
  }
  fillRoundedRect(buf, width, height, margin * 0.4, margin * 0.4, width - margin * 0.4, height - margin * 0.4, Math.min(width, height) * 0.08, bg[0] + 6, bg[1] + 6, bg[2] + 10);

  const x0 = Math.round(margin), x1 = Math.round(width - margin);
  const cx = width / 2;
  const topY = margin * 1.1;
  const bottomY = height - margin * 1.1;
  const a = (bottomY - topY) / Math.pow((x1 - cx), 2);
  let prevX = null, prevY = null;
  const thickness = Math.max(2, Math.round(width / 220));
  for (let x = x0; x <= x1; x++) {
    const y = Math.round(bottomY - a * Math.pow(x - cx, 2));
    if (prevX !== null) drawLine(buf, width, prevX, prevY, x, y, curveColor[0], curveColor[1], curveColor[2], thickness);
    prevX = x; prevY = y;
  }

  const tx = cx + (x1 - cx) * 0.45;
  const ty = Math.round(bottomY - a * Math.pow(tx - cx, 2));
  const slope = -2 * a * (tx - cx);
  const tanLen = (x1 - x0) * 0.32;
  const tx0 = tx - tanLen / 2, ty0 = ty - slope * (tanLen / 2);
  const tx1 = tx + tanLen / 2, ty1 = ty + slope * (tanLen / 2);
  drawLine(buf, width, Math.round(tx0), Math.round(ty0), Math.round(tx1), Math.round(ty1), tangentColor[0], tangentColor[1], tangentColor[2], thickness);

  const r = Math.max(4, Math.round(width / 45));
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      if (dx * dx + dy * dy <= r * r) setPixel(buf, width, Math.round(tx) + dx, Math.round(ty) + dy, dotColor[0], dotColor[1], dotColor[2]);
    }
  }
  return buf;
}

const navy = [23, 36, 63];
const cream = [248, 246, 241];
const gold = [196, 149, 74];

const iconSize = 512;
writeFileSync(new URL('../public/icon-512.png', import.meta.url), encodePNG(iconSize, iconSize, makeGraphic(iconSize, iconSize, { curveColor: cream, tangentColor: gold, dotColor: gold, bg: navy, margin: iconSize * 0.14 })));

const icon192 = 192;
writeFileSync(new URL('../public/icon-192.png', import.meta.url), encodePNG(icon192, icon192, makeGraphic(icon192, icon192, { curveColor: cream, tangentColor: gold, dotColor: gold, bg: navy, margin: icon192 * 0.14 })));

const appleSize = 180;
writeFileSync(new URL('../public/apple-touch-icon.png', import.meta.url), encodePNG(appleSize, appleSize, makeGraphic(appleSize, appleSize, { curveColor: cream, tangentColor: gold, dotColor: gold, bg: navy, margin: appleSize * 0.14 })));

const ogW = 1200, ogH = 630;
writeFileSync(new URL('../public/og-image.png', import.meta.url), encodePNG(ogW, ogH, makeGraphic(ogW, ogH, { curveColor: cream, tangentColor: gold, dotColor: gold, bg: navy, margin: 90 })));

console.log('Generated icon-512.png, icon-192.png, apple-touch-icon.png, og-image.png');
