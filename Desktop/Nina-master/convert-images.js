const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const CONFIGS = [
  { dir: "./assets/images/slider",                  maxWidth: 1920, quality: 80 },
  { dir: "./assets/images/gallery/concerts",         maxWidth: 800,  quality: 80 },
  { dir: "./assets/images/gallery/entreprise",       maxWidth: 800,  quality: 80 },
  { dir: "./assets/images/gallery/mariage",          maxWidth: 800,  quality: 80 },
  { dir: "./assets/images/gallery/portraits",        maxWidth: 800,  quality: 80 },
  { dir: "./assets/images",                          maxWidth: 500,  quality: 80, files: ["nina.png", "camera.png"] },
];

async function convertFile(filePath, maxWidth, quality) {
  const ext = path.extname(filePath).toLowerCase();
  if (![".jpg", ".jpeg", ".png"].includes(ext)) return;

  const originalSize = Math.round(fs.statSync(filePath).size / 1024);

  // Lire le fichier en mémoire pour éviter le verrouillage Windows
  const inputBuffer = fs.readFileSync(filePath);

  // Créer la version WebP redimensionnée
  const outputPath = filePath.replace(/\.(jpg|jpeg|png)$/i, ".webp");
  await sharp(inputBuffer)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality })
    .toFile(outputPath);
  const webpSize = Math.round(fs.statSync(outputPath).size / 1024);
  console.log(`${path.basename(filePath)} → webp  (${originalSize}Ko → ${webpSize}Ko)`);

  // Redimensionner l'original en place (fallback)
  let resizedBuffer;
  if (ext === ".jpg" || ext === ".jpeg") {
    resizedBuffer = await sharp(inputBuffer)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .jpeg({ quality, progressive: true })
      .toBuffer();
  } else if (ext === ".png") {
    resizedBuffer = await sharp(inputBuffer)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .png()
      .toBuffer();
  }

  if (resizedBuffer) {
    const tempPath = filePath + ".tmp";
    fs.writeFileSync(tempPath, resizedBuffer);
    fs.unlinkSync(filePath);
    fs.renameSync(tempPath, filePath);
    const newSize = Math.round(resizedBuffer.length / 1024);
    console.log(`${path.basename(filePath)} → resized (${originalSize}Ko → ${newSize}Ko)`);
  }
}

(async () => {
  for (const config of CONFIGS) {
    const allFiles = fs.readdirSync(config.dir);
    const targets = config.files
      ? allFiles.filter(f => config.files.includes(f))
      : allFiles;

    for (const file of targets) {
      await convertFile(path.join(config.dir, file), config.maxWidth, config.quality);
    }
  }
  console.log("\nConversion terminée !");
})();
