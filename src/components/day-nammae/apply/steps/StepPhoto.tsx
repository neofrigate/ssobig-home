import Image from "next/image";
import { ChangeEvent } from "react";

interface StepPhotoProps {
  photoPreviewUrl: string;
  onPhotoChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function StepPhoto({
  photoPreviewUrl,
  onPhotoChange,
}: StepPhotoProps) {
  return (
    <div>
      <label className="flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-8 text-center transition active:bg-white/10">
        {photoPreviewUrl ? (
          <div className="w-full">
            <div className="relative mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-2xl">
              <Image
                src={photoPreviewUrl}
                alt="업로드한 프로필 미리보기"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <p className="mt-4 text-xs font-semibold text-[#FF6B9F]">
              다른 사진으로 변경하기
            </p>
          </div>
        ) : (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-white/60">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 7h4l2-2h6l2 2h4v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                />
                <circle cx="12" cy="13" r="3.5" strokeWidth={1.5} />
              </svg>
            </div>
            <p className="mt-4 text-sm font-semibold text-white/70">
              사진 선택하기
            </p>
            <p className="mt-1 text-xs text-white/35">
              본인의 매력이 잘 드러나는 사진 한 장을 올려주세요
            </p>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={onPhotoChange}
          className="hidden"
        />
      </label>
    </div>
  );
}
