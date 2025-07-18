import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a simple SVG icon
const createIconSVG = (size) => {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#fbbf24;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="20" fill="url(#grad)"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size/4}" fill="white" opacity="0.9"/>
  <text x="${size/2}" y="${size/2 + size/20}" text-anchor="middle" fill="#1f2937" font-family="Arial, sans-serif" font-size="${size/6}" font-weight="bold">$</text>
</svg>`;
};

// Convert SVG to PNG using Canvas (simplified version)
const svgToPng = (svg, size) => {
  // For demo purposes, we'll create a simple colored square
  // In a real implementation, you'd use a library like sharp or canvas
  const canvas = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#fbbf24"/>
      <circle cx="${size/2}" cy="${size/2}" r="${size/4}" fill="white"/>
      <text x="${size/2}" y="${size/2 + 5}" text-anchor="middle" fill="#1f2937" font-family="Arial, sans-serif" font-size="${size/6}" font-weight="bold">$</text>
    </svg>
  `;
  return svg;
};

// Generate icons
const sizes = [192, 512];

sizes.forEach(size => {
  const svg = createIconSVG(size);
  const pngPath = path.join(__dirname, '..', 'public', `icon-${size}x${size}.png`);
  
  // For demo purposes, save as SVG with .png extension
  // In production, you'd convert to actual PNG
  fs.writeFileSync(pngPath.replace('.png', '.svg'), svg);
  console.log(`Generated icon-${size}x${size}.svg`);
});

console.log('Icon generation complete!');
console.log('Note: These are SVG files with .png extensions for demo purposes.');
console.log('In production, convert them to actual PNG files using a library like sharp.'); 