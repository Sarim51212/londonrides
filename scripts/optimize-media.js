// Generates web-optimised media from the raw design assets.
// Run with: npm run optimize-media
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import ffmpeg from 'ffmpeg-static';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const pub = (...p) => path.join(root, 'public', ...p);
const run = (args) => execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });

mkdirSync(pub('videos'), { recursive: true });
const src = path.join(root, 'assets-src', 'hero.mp4');

// Muted, fast-start videos: 1080p for desktop, 720p for mobile data plans.
run(['-i', src, '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '26', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-vf', 'scale=1920:-2', pub('videos', 'hero-1080.mp4')]);
run(['-i', src, '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '28', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-vf', 'scale=1280:-2', pub('videos', 'hero-720.mp4')]);

// First frame as poster so the hero never flashes empty.
const posterPng = path.join(root, 'assets-src', 'poster.png');
run(['-ss', '0.2', '-i', src, '-frames:v', '1', posterPng]);
await sharp(posterPng).resize(1600).webp({ quality: 72 }).toFile(pub('images', 'hero-poster.webp'));

const images = ['hero', 'e-class', 's-class', 'v-class', 'saloon', 'sprinter'];
for (const name of images) {
  const file = `${name}.jpg`;
  if (!existsSync(path.join(root, 'assets-src', file))) continue;
  await sharp(path.join(root, 'assets-src', file)).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 74 }).toFile(pub('images', `${name}.webp`));
}

// Logo: trim the dark halo, keep the gold crest, export small sizes.
await sharp(path.join(root, 'assets-src', 'logo.png')).resize({ width: 480 }).webp({ quality: 85 }).toFile(pub('images', 'logo.webp'));
await sharp(path.join(root, 'assets-src', 'logo.png')).extract({ left: 520, top: 90, width: 560, height: 600 }).resize(192, 192, { fit: 'cover' }).png().toFile(pub('favicon.png'));

console.log('Media optimised.');
