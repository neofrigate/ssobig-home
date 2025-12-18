import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(
  __dirname,
  "../public/ssobig_assets/project/250920-youth-day-insomnia-mafia"
);

const imageFiles = ["현장 1.png", "현장 2.png", "현장 3.png", "현장 4.png"];

async function convertToWebP() {
  console.log("이미지 WebP 변환 시작...\n");

  for (const imageFile of imageFiles) {
    const inputPath = path.join(sourceDir, imageFile);
    const outputFileName = imageFile.replace(/\.png$/i, ".webp");
    const outputPath = path.join(sourceDir, outputFileName);

    if (!fs.existsSync(inputPath)) {
      console.log(`⚠ ${imageFile} 파일을 찾을 수 없습니다.`);
      continue;
    }

    try {
      const stats = fs.statSync(inputPath);
      const originalSize = stats.size;

      await sharp(inputPath).webp({ quality: 85 }).toFile(outputPath);

      const optimizedStats = fs.statSync(outputPath);
      const optimizedSize = optimizedStats.size;
      const reduction = ((1 - optimizedSize / originalSize) * 100).toFixed(1);

      console.log(
        `✓ ${imageFile}: ${(originalSize / 1024).toFixed(1)}KB → ${(
          optimizedSize / 1024
        ).toFixed(1)}KB (${reduction}% 감소)`
      );
    } catch (error) {
      console.error(`✗ ${imageFile} 변환 실패:`, error.message);
    }
  }

  console.log("\n=== 변환 완료 ===");
}

convertToWebP().catch(console.error);
