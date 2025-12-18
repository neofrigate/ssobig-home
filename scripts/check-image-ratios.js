import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const playroomDir = path.join(__dirname, "../public/ssobig_assets/playroom");

// 확인할 이미지 파일들
const targetImages = [
  "퀴즈메이커.jpg",
  "나몰라퀴즈.jpg",
  "사랑의 징검다리.jpg",
  "우정의 징검다리.jpg",
  "생산성_자리배치.png",
  "생산성_투표-1.png",
  "생산성_투표.png",
];

async function checkImageRatio(imagePath) {
  try {
    const metadata = await sharp(imagePath).metadata();
    const width = metadata.width;
    const height = metadata.height;
    const ratio = width / height;
    const aspectRatio = `${width}:${height}`;

    return {
      filename: path.basename(imagePath),
      width,
      height,
      ratio: ratio.toFixed(3),
      aspectRatio,
    };
  } catch (error) {
    return {
      filename: path.basename(imagePath),
      error: error.message,
    };
  }
}

async function main() {
  console.log("이미지 비율 확인 중...\n");
  console.log("현재 카드 비율: 3:4 (0.750)\n");
  console.log("=".repeat(60));

  const results = [];

  for (const imageFile of targetImages) {
    const imagePath = path.join(playroomDir, imageFile);

    if (!fs.existsSync(imagePath)) {
      console.log(`⚠ ${imageFile}: 파일을 찾을 수 없습니다.`);
      continue;
    }

    const result = await checkImageRatio(imagePath);
    results.push(result);

    if (result.error) {
      console.log(`✗ ${result.filename}: ${result.error}`);
    } else {
      const match = result.ratio === "0.750" ? "✓" : "⚠";
      console.log(`${match} ${result.filename}:`);
      console.log(`  크기: ${result.width} x ${result.height}`);
      console.log(`  비율: ${result.aspectRatio} (${result.ratio})`);
      if (result.ratio !== "0.750") {
        const diff = ((parseFloat(result.ratio) - 0.75) * 100).toFixed(1);
        console.log(`  차이: ${diff > 0 ? "+" : ""}${diff}%`);
      }
      console.log("");
    }
  }

  console.log("=".repeat(60));
  console.log("\n요약:");
  const matching = results.filter(
    (r) => !r.error && r.ratio === "0.750"
  ).length;
  const total = results.filter((r) => !r.error).length;
  console.log(`- 3:4 비율과 일치: ${matching}/${total}개`);
  console.log(`- 비율이 다른 이미지: ${total - matching}개`);
}

main().catch(console.error);
