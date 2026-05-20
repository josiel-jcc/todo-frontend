import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const iconsDir = path.join(publicDir, 'icons');
const svgPath = path.join(publicDir, 'favicon.svg');

const sizes = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-maskable-512.png', size: 512, maskable: true },
];

const svg = await readFile(svgPath);
await mkdir(iconsDir, { recursive: true });

for (const { name, size, maskable } of sizes) {
  const outputPath = path.join(iconsDir, name);

  if (maskable) {
    const iconSize = Math.round(size * 0.6);
    const padding = Math.round((size - iconSize) / 2);
    const iconBuffer = await sharp(svg).resize(iconSize, iconSize).png().toBuffer();

    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: '#0033ad',
      },
    })
      .composite([{ input: iconBuffer, top: padding, left: padding }])
      .png()
      .toFile(outputPath);
  } else {
    await sharp(svg).resize(size, size).png().toFile(outputPath);
  }

  console.log(`Generated ${name}`);
}
