import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, "../public/ssobig_assets/bestcut");
const outputDir = path.join(
  __dirname,
  "../public/ssobig_assets/bestcut/optimized"
);

// 출력 디렉토리 생성
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const imageFiles = [
  "DSC00476.JPG",
  "DSC00696.JPG",
  "DSC00735.JPG",
  "DSC00749.JPG",
  "DSC00797.JPG",
  "DSC01102.JPG",
  "DSC08866.jpg",
  "DSC09371.jpg",
  "DSC09461.jpg",
  "P1110584.JPG의 사본.jpg",
  "P1110690.JPG의 사본.jpg",
  "P1110712.JPG의 사본.jpg",
];

async function optimizeImage(inputPath, outputPath) {
  try {
    const stats = fs.statSync(inputPath);
    const originalSize = stats.size;

    // 이미지 최적화: 최대 너비 1200px, 품질 85%, WebP 형식으로 변환
    await sharp(inputPath)
      .resize(1200, null, {
        withoutEnlargement: true,
        fit: "inside",
      })
      .webp({ quality: 85 })
      .toFile(outputPath.replace(/\.(jpg|jpeg|JPG)$/i, ".webp"));

    const optimizedStats = fs.statSync(
      outputPath.replace(/\.(jpg|jpeg|JPG)$/i, ".webp")
    );
    const optimizedSize = optimizedStats.size;
    const reduction = ((1 - optimizedSize / originalSize) * 100).toFixed(1);

    console.log(
      `✓ ${path.basename(inputPath)}: ${(originalSize / 1024).toFixed(
        1
      )}KB → ${(optimizedSize / 1024).toFixed(1)}KB (${reduction}% 감소)`
    );

    return { originalSize, optimizedSize, reduction };
  } catch (error) {
    console.error(`✗ ${path.basename(inputPath)} 처리 실패:`, error.message);
    return null;
  }
}

async function main() {
  console.log("이미지 최적화 시작...\n");

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;

  for (const imageFile of imageFiles) {
    const inputPath = path.join(sourceDir, imageFile);

    if (!fs.existsSync(inputPath)) {
      console.log(`⚠ ${imageFile} 파일을 찾을 수 없습니다.`);
      continue;
    }

    const outputPath = path.join(outputDir, imageFile);
    const result = await optimizeImage(inputPath, outputPath);

    if (result) {
      totalOriginalSize += result.originalSize;
      totalOptimizedSize += result.optimizedSize;
    }
  }

  console.log("\n=== 최적화 완료 ===");
  console.log(
    `전체 크기: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB → ${(
      totalOptimizedSize /
      1024 /
      1024
    ).toFixed(2)}MB`
  );
  console.log(
    `전체 감소율: ${(
      (1 - totalOptimizedSize / totalOriginalSize) *
      100
    ).toFixed(1)}%`
  );
  console.log(`\n최적화된 이미지는 ${outputDir} 폴더에 저장되었습니다.`);
}

main().catch(console.error);






