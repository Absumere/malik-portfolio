const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [16, 32, 180]; // 16x16, 32x32, and 180x180 (apple-touch-icon)
const inputSvg = path.join(__dirname, '../public/favicons/favicon.svg');
const outputDir = path.join(__dirname, '../public/favicons');

async function generateFavicons() {
  const svgBuffer = fs.readFileSync(inputSvg);

  // Generate PNG favicons
  for (const size of sizes) {
    const fileName = size === 180 ? 'apple-touch-icon.png' : `favicon-${size}x${size}.png`;
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(outputDir, fileName));
    console.log(`Generated ${fileName}`);
  }

  // Generate ICO file (combines 16x16 and 32x32)
  const favicon16 = await sharp(svgBuffer)
    .resize(16, 16)
    .png()
    .toBuffer();

  const favicon32 = await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toBuffer();

  // Write the ICO file
  const icoPath = path.join(outputDir, 'favicon.ico');
  fs.writeFileSync(icoPath, Buffer.concat([favicon16, favicon32]));
  console.log('Generated favicon.ico');
}

generateFavicons().catch(console.error);
