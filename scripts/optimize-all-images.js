import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, "../public");

// 이미지 확장자
const imageExtensions = [".jpg", ".jpeg", ".png", ".JPG", ".JPEG", ".PNG"];

// 최적화할 이미지 파일 찾기
function findImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // optimized 폴더는 제외
      if (!filePath.includes("optimized")) {
        findImageFiles(filePath, fileList);
      }
    } else {
      const ext = path.extname(file).toLowerCase();
      if (imageExtensions.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

async function optimizeImage(inputPath) {
  try {
    const stats = fs.statSync(inputPath);
    const originalSize = stats.size;
    const ext = path.extname(inputPath).toLowerCase();
    const isJpeg =
      ext === ".jpg" || ext === ".jpeg" || ext === ".JPG" || ext === ".JPEG";
    const isPng = ext === ".png" || ext === ".PNG";

    // 이미지 메타데이터 확인
    const metadata = await sharp(inputPath).metadata();
    const width = metadata.width;
    const height = metadata.height;

    // 임시 파일 경로
    const tempPath = inputPath + ".tmp";

    let sharpInstance = sharp(inputPath);

    // 큰 이미지는 리사이즈 (최대 너비/높이 2400px)
    if (width > 2400 || height > 2400) {
      sharpInstance = sharpInstance.resize(2400, 2400, {
        withoutEnlargement: true,
        fit: "inside",
      });
    }

    // 형식별 최적화
    if (isJpeg) {
      await sharpInstance
        .jpeg({
          quality: 85,
          mozjpeg: true, // mozjpeg 사용으로 더 나은 압축
          progressive: true,
        })
        .toFile(tempPath);
    } else if (isPng) {
      await sharpInstance
        .png({
          quality: 90,
          compressionLevel: 9,
          adaptiveFiltering: true,
        })
        .toFile(tempPath);
    } else {
      // 기타 형식은 그대로 복사
      fs.copyFileSync(inputPath, tempPath);
    }

    const optimizedStats = fs.statSync(tempPath);
    const optimizedSize = optimizedStats.size;

    // 최적화된 파일이 원본보다 작거나 같을 때만 교체
    if (optimizedSize < originalSize) {
      // 원본 백업 (선택사항 - 필요시 주석 해제)
      // fs.copyFileSync(inputPath, inputPath + ".backup");

      // 원본 파일을 최적화된 파일로 교체
      fs.renameSync(tempPath, inputPath);

      const reduction = ((1 - optimizedSize / originalSize) * 100).toFixed(1);
      const relativePath = path.relative(publicDir, inputPath);

      console.log(
        `✓ ${relativePath}: ${(originalSize / 1024).toFixed(1)}KB → ${(
          optimizedSize / 1024
        ).toFixed(1)}KB (${reduction}% 감소)`
      );

      return { originalSize, optimizedSize, reduction, success: true };
    } else {
      // 최적화된 파일이 더 크면 원본 유지
      fs.unlinkSync(tempPath);
      const relativePath = path.relative(publicDir, inputPath);
      console.log(
        `- ${relativePath}: 이미 최적화됨 (${(originalSize / 1024).toFixed(
          1
        )}KB)`
      );
      return {
        originalSize,
        optimizedSize: originalSize,
        reduction: 0,
        success: false,
      };
    }
  } catch (error) {
    // 임시 파일 정리
    const tempPath = inputPath + ".tmp";
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    const relativePath = path.relative(publicDir, inputPath);
    console.error(`✗ ${relativePath} 처리 실패:`, error.message);
    return null;
  }
}

async function main() {
  console.log("이미지 최적화 시작...\n");
  console.log(`검색 디렉토리: ${publicDir}\n`);

  const imageFiles = findImageFiles(publicDir);
  console.log(`총 ${imageFiles.length}개의 이미지 파일을 찾았습니다.\n`);

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (let i = 0; i < imageFiles.length; i++) {
    const imagePath = imageFiles[i];
    const result = await optimizeImage(imagePath);

    if (result) {
      totalOriginalSize += result.originalSize;
      totalOptimizedSize += result.optimizedSize;
      if (result.success) {
        successCount++;
      } else {
        skipCount++;
      }
    } else {
      errorCount++;
    }

    // 진행률 표시
    if ((i + 1) % 10 === 0 || i === imageFiles.length - 1) {
      const progress = (((i + 1) / imageFiles.length) * 100).toFixed(1);
      console.log(`\n[진행률: ${progress}%] (${i + 1}/${imageFiles.length})\n`);
    }
  }

  console.log("\n=== 최적화 완료 ===");
  console.log(`처리된 파일: ${imageFiles.length}개`);
  console.log(`  - 최적화 성공: ${successCount}개`);
  console.log(`  - 이미 최적화됨: ${skipCount}개`);
  console.log(`  - 오류: ${errorCount}개`);
  console.log(
    `\n전체 크기: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB → ${(
      totalOptimizedSize /
      1024 /
      1024
    ).toFixed(2)}MB`
  );
  const totalReduction =
    totalOriginalSize > 0
      ? ((1 - totalOptimizedSize / totalOriginalSize) * 100).toFixed(1)
      : 0;
  console.log(`전체 감소율: ${totalReduction}%`);
  console.log(
    `\n절약된 용량: ${(
      (totalOriginalSize - totalOptimizedSize) /
      1024 /
      1024
    ).toFixed(2)}MB`
  );
}

main().catch(console.error);
