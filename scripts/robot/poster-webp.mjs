// Converts the Blender poster PNG (with alpha) to the WebP the homepage uses.
import sharp from 'sharp';
const [input, output] = process.argv.slice(2);
const info = await sharp(input).webp({ quality: 82, alphaQuality: 90, effort: 6 }).toFile(output);
console.log(`poster ${output} ${Math.round(info.size / 1024)} KB`);
