import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(
  __dirname,
  "../public/ssobig_assets/offline/mafia/불면증마피아2.png"
);
const outputPath = path.join(
  __dirname,
  "../public/ssobig_assets/offline/mafia/불면증마피아2.webp"
);

async function convertToWebP() {
  try {
    await sharp(inputPath).webp({ quality: 85 }).toFile(outputPath);

    console.log(`✓ 변환 완료: ${outputPath}`);
  } catch (error) {
    console.error(`✗ 변환 실패:`, error.message);
    process.exit(1);
  }
}

convertToWebP();
