export type PlayroomTemplateAssetEntry = {
  posterImageUrl: string;
  backgroundImageUrl: string;
  logoImageUrl: string;
  themeColor: string | number | null;
  isDarkMode: boolean;
};

const PLAYROOM_TEMPLATE_ASSET_OVERRIDES: Record<
  string,
  PlayroomTemplateAssetEntry
> = {
  "기억 속의 너": {
    posterImageUrl:
      "https://firebasestorage.googleapis.com/v0/b/ssobig.appspot.com/o/game%2Fc15f4701-98fd-11f0-a258-ab6ef6d474db%2Fuser%2FTJ2QsY6yffc0rQzSr5KZnF7kveh1%2F1758792630418_XIxBDyHp_66b517b1-99b8-44fa-883e-88d6957c95bb?alt=media&token=7936b940-02b1-4c04-8f84-1ebc8643540b",
    backgroundImageUrl:
      "https://firebasestorage.googleapis.com/v0/b/ssobig.appspot.com/o/game%2Faaa426a0-97d8-11f0-9ae1-619db627eb2d%2Fuser%2FTJ2QsY6yffc0rQzSr5KZnF7kveh1%2F1758562330740_p6RGmlDn_%ED%95%98%EB%8A%983.jpg?alt=media&token=bcc6ddda-3f36-47c3-873b-fcc8e119bf47",
    logoImageUrl:
      "https://firebasestorage.googleapis.com/v0/b/ssobig.appspot.com/o/game%2Faaa426a0-97d8-11f0-9ae1-619db627eb2d%2Fuser%2FTJ2QsY6yffc0rQzSr5KZnF7kveh1%2F1758562519740_g6AWsgl2_%EB%A1%9C%EA%B3%A0_%EC%9D%B4%EB%AF%B8%EC%A7%80.png?alt=media&token=00149626-83af-4d64-9058-4c78580370f9",
    themeColor: 4278228616,
    isDarkMode: false,
  },
  "도플갱어": {
    posterImageUrl:
      "https://firebasestorage.googleapis.com/v0/b/ssobig.appspot.com/o/game%2F3904b350-ed3e-11f0-84a8-0d2a6b375146%2Fuser%2FTJ2QsY6yffc0rQzSr5KZnF7kveh1%2Fvariants%2F1767952925095_0EBu0J1z_02c95a7b-2ba4-4e61-b4b6-6debe71cb53d__thumbnail.webp?alt=media&token=11330e10-8071-4b6e-a2ba-ff4cd92be5f7",
    backgroundImageUrl:
      "https://firebasestorage.googleapis.com/v0/b/ssobig.appspot.com/o/game%2F56202d41-ed19-11f0-8763-e7d9f53dab13%2Fuser%2FfQW0MBOupCRwIvr2yQpyaAAnFis2%2Fvariants%2F1767935413916_NYYGAk46_%EC%95%B1_%EB%B0%B0%EA%B2%BD_9_16___mobile.webp?alt=media&token=5299626f-0c2d-431d-8046-709c96e7a238",
    logoImageUrl:
      "https://firebasestorage.googleapis.com/v0/b/ssobig.appspot.com/o/game%2F3904b350-ed3e-11f0-84a8-0d2a6b375146%2Fuser%2FTJ2QsY6yffc0rQzSr5KZnF7kveh1%2Fvariants%2F1767952879964_wFnc6pZo_PR_title__thumbnail.webp?alt=media&token=2cb65047-30fd-4643-baf7-6673c204d7f3",
    themeColor: 4288375019,
    isDarkMode: true,
  },
  "마이 해피 스토리": {
    posterImageUrl:
      "https://firebasestorage.googleapis.com/v0/b/ssobig.appspot.com/o/g%2F144e3270%2Fu%2F2RXCQ2dP%2Fvariants%2Fmlbudhy2_A1jh__thumbnail.webp?alt=media&token=d902e396-7fdc-4eed-a5a0-d9e0ec5e1bca",
    backgroundImageUrl:
      "https://firebasestorage.googleapis.com/v0/b/ssobig.appspot.com/o/g%2F30159a60%2Fu%2FTJ2QsY6y%2Fvariants%2Fmmyfc3h6_dxX3__mobile.webp?alt=media&token=e2921e0d-3b95-4bda-97c0-22c4ce824773",
    logoImageUrl:
      "https://firebasestorage.googleapis.com/v0/b/ssobig.appspot.com/o/g%2F144e3270%2Fu%2F2RXCQ2dP%2Fvariants%2Fmlbue7hf_UJlq__thumbnail.webp?alt=media&token=4b74c95a-f5bb-46b4-80c0-1b3f98fde67a",
    themeColor: 4294324589,
    isDarkMode: false,
  },
  "밤 아일랜드": {
    posterImageUrl:
      "https://firebasestorage.googleapis.com/v0/b/ssobig.appspot.com/o/g%2F8cf64700%2Fu%2FTJ2QsY6y%2Fmn5tqu17_91bh?alt=media&token=0b4d30f2-5aa4-441b-a048-45216622f862",
    backgroundImageUrl:
      "https://firebasestorage.googleapis.com/v0/b/ssobig.appspot.com/o/g%2F8cf64700%2Fu%2FTJ2QsY6y%2Fmn5tr5ki_ZSuo.png?alt=media&token=b97f4e37-8157-4b46-aeb0-ff0396f4c397",
    logoImageUrl:
      "https://firebasestorage.googleapis.com/v0/b/ssobig.appspot.com/o/g%2F8cf64700%2Fu%2FTJ2QsY6y%2Fmn5trd7x_R2pR.png?alt=media&token=12b3613d-2442-45ed-8249-5089c42ad26a",
    themeColor: 4278255385,
    isDarkMode: false,
  },
  "백설공주의 독사과": {
    posterImageUrl:
      "https://firebasestorage.googleapis.com/v0/b/ssobig.appspot.com/o/game%2F06143321-dcaf-11f0-a3e8-1358cca2e38d%2Fuser%2F2RXCQ2dPSVQQHzGbLEPnuxXO8U22%2Fvariants%2F1766206018342_osc9Gx0K_ver_1__thumbnail.webp?alt=media&token=e31e2af2-90c9-4af7-bf8f-7674d955a59d",
    backgroundImageUrl:
      "https://firebasestorage.googleapis.com/v0/b/zombie-run-ae82c.appspot.com/o/game%2F40f206d1-c908-11f0-8447-8dcf4713c2d2%2Fuser%2FtoCv7gseHqSSHYy0D4MPTYuJ5cq2%2Fvariants%2F1763970179529_83d9NH6V_%EC%96%91%ED%94%BC%EC%A7%80__mobile.webp?alt=media&token=c210d7df-26ec-4b6d-9e7b-a5a0e3346c68",
    logoImageUrl:
      "https://firebasestorage.googleapis.com/v0/b/ssobig.appspot.com/o/game%2F06143321-dcaf-11f0-a3e8-1358cca2e38d%2Fuser%2F2RXCQ2dPSVQQHzGbLEPnuxXO8U22%2Fvariants%2F1766206038450_n67ZKDFx_ver_only_logo__thumbnail.webp?alt=media&token=c5199878-da71-43b1-84da-8b1ef9991b71",
    themeColor: 4294066485,
    isDarkMode: false,
  },
  슈가빌리지: {
    posterImageUrl:
      "https://firebasestorage.googleapis.com/v0/b/ssobig.appspot.com/o/g%2F6aa00980%2Fu%2FTJ2QsY6y%2Fvariants%2Fmmeae6ug_wxbU__thumbnail.webp?alt=media&token=73f11f44-5d24-4e8a-9610-997c02a1208b",
    backgroundImageUrl:
      "https://firebasestorage.googleapis.com/v0/b/ssobig.appspot.com/o/g%2F6aa00980%2Fu%2FTJ2QsY6y%2Fvariants%2Fmmeak2pf_NxQ0__mobile.webp?alt=media&token=69fb081d-4cc6-4a54-a963-256ab47f195b",
    logoImageUrl:
      "https://firebasestorage.googleapis.com/v0/b/ssobig.appspot.com/o/g%2F6aa00980%2Fu%2FTJ2QsY6y%2Fvariants%2Fmmeakfl5_BqFN__thumbnail.webp?alt=media&token=6665d0d0-c842-427e-a716-15e2cc5a965e",
    themeColor: 4291121880,
    isDarkMode: false,
  },
  위령: {
    posterImageUrl:
      "https://firebasestorage.googleapis.com/v0/b/ssobig.appspot.com/o/game%2F3904b350-ed3e-11f0-84a8-0d2a6b375146%2Fuser%2FTJ2QsY6yffc0rQzSr5KZnF7kveh1%2Fvariants%2F1767952925095_0EBu0J1z_02c95a7b-2ba4-4e61-b4b6-6debe71cb53d__thumbnail.webp?alt=media&token=11330e10-8071-4b6e-a2ba-ff4cd92be5f7",
    backgroundImageUrl:
      "https://firebasestorage.googleapis.com/v0/b/ssobig.appspot.com/o/game%2F56202d41-ed19-11f0-8763-e7d9f53dab13%2Fuser%2FfQW0MBOupCRwIvr2yQpyaAAnFis2%2Fvariants%2F1767935413916_NYYGAk46_%EC%95%B1_%EB%B0%B0%EA%B2%BD_9_16___mobile.webp?alt=media&token=5299626f-0c2d-431d-8046-709c96e7a238",
    logoImageUrl:
      "https://firebasestorage.googleapis.com/v0/b/ssobig.appspot.com/o/game%2F3904b350-ed3e-11f0-84a8-0d2a6b375146%2Fuser%2FTJ2QsY6yffc0rQzSr5KZnF7kveh1%2Fvariants%2F1767952879964_wFnc6pZo_PR_title__thumbnail.webp?alt=media&token=2cb65047-30fd-4643-baf7-6673c204d7f3",
    themeColor: 4288375019,
    isDarkMode: true,
  },
  "일일남매 테스트": {
    posterImageUrl:
      "https://firebasestorage.googleapis.com/v0/b/zombie-run-ae82c.appspot.com/o/game%2F6e709240-da1e-11ef-b573-8b6f128c0f1e%2Fuser%2FjuOK5nYyibQfpyqrAbhTUDE1Xf02%2Fe75a8050-ff9c-4a65-bab2-5cda39677933Property%201%3D1.png?alt=media&token=5b08df43-0a9f-4822-99d4-25a0f631bcc7",
    backgroundImageUrl:
      "https://firebasestorage.googleapis.com/v0/b/zombie-run-ae82c.appspot.com/o/game%2Fac218500-a88d-1116-90bb-25b2f6c9d5ed%2Fuser%2F6ttIgewWkySdPERFdvAfk8hfYlB3%2F754fc30a-147f-454f-91b8-9ad7935fba79SB_%EC%BB%A4%EC%8A%A4%ED%85%80%20%EB%B0%B0%EA%B2%BD%20%EC%9D%B4%EB%AF%B8%EC%A7%80.png?alt=media&token=eca9b403-fd0c-46c7-a40b-dee31afd4945",
    logoImageUrl:
      "https://firebasestorage.googleapis.com/v0/b/zombie-run-ae82c.appspot.com/o/game%2Ffe4b4e71-99d4-11f0-aec3-19170a0c090b%2Fuser%2FjuOK5nYyibQfpyqrAbhTUDE1Xf02%2F1758964839020_PtLo2HOW_Frame_599.png?alt=media&token=26fb831d-1588-4406-a847-f58823b875c6",
    themeColor: 4293467747,
    isDarkMode: false,
  },
  "하얀방": {
    posterImageUrl:
      "https://firebasestorage.googleapis.com/v0/b/ssobig.appspot.com/o/g%2F6e838830%2Fu%2FTJ2QsY6y%2Fmo6tauwc_f33a?alt=media&token=9d0d33b9-1370-44e7-b30e-9ba68e01d11f",
    backgroundImageUrl:
      "https://firebasestorage.googleapis.com/v0/b/ssobig.appspot.com/o/g%2F6e838830%2Fu%2FTJ2QsY6y%2Fmo6tm1e8_q7sa?alt=media&token=44f0a124-e079-494b-8f7a-3d2fdbfea98b",
    logoImageUrl:
      "https://firebasestorage.googleapis.com/v0/b/ssobig.appspot.com/o/g%2F6e838830%2Fu%2FTJ2QsY6y%2Fvariants%2Fmo6toeck_WFSo__thumbnail.webp?alt=media&token=f58fa9e2-5f22-44c7-bfd4-e6cabb008e2f",
    themeColor: 4286874756,
    isDarkMode: false,
  },
  "황후마마 살인사건": {
    posterImageUrl:
      "https://firebasestorage.googleapis.com/v0/b/ssobig.appspot.com/o/game%2F107b3721-e545-11f0-b8ac-efafa41d9a03%2Fuser%2FTJ2QsY6yffc0rQzSr5KZnF7kveh1%2Fvariants%2F1767074673332_kyBv1Qya_2bee2d28-8486-4c80-80fd-2c76f9997dd0__thumbnail.webp?alt=media&token=cd720a29-2d89-4ca9-ae7c-512f908c74e1",
    backgroundImageUrl:
      "https://firebasestorage.googleapis.com/v0/b/ssobig.appspot.com/o/game%2F107b3721-e545-11f0-b8ac-efafa41d9a03%2Fuser%2FTJ2QsY6yffc0rQzSr5KZnF7kveh1%2Fvariants%2F1767156716381_1OazMC0B_5ce66fe5-cd3b-4f18-9143-633f23ce581d__mobile.webp?alt=media&token=c5eb63f4-95cb-4c77-b1de-342764b0db8e",
    logoImageUrl:
      "https://firebasestorage.googleapis.com/v0/b/ssobig.appspot.com/o/game%2F107b3721-e545-11f0-b8ac-efafa41d9a03%2Fuser%2FTJ2QsY6yffc0rQzSr5KZnF7kveh1%2Fvariants%2F1767074963664_HqGtqnAx_ver_only_logo__thumbnail.webp?alt=media&token=52485161-3118-44c6-9734-ee7e3fe7243a",
    themeColor: 4288834391,
    isDarkMode: false,
  },
};

export function normalizePlayroomTemplateAssetKey(value: string) {
  return value
    .replace(/\([^)]*\)/g, "")
    .replace(/\.ver\d+/gi, "")
    .replace(/\s*\d+(?:[/:]\d+)*(?::\d+)?$/g, "")
    .replace(/\d+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function getPlayroomTemplateAssetOverride(...titles: Array<string | null | undefined>) {
  for (const title of titles) {
    const normalized = normalizePlayroomTemplateAssetKey(String(title || ""));
    if (normalized && PLAYROOM_TEMPLATE_ASSET_OVERRIDES[normalized]) {
      return PLAYROOM_TEMPLATE_ASSET_OVERRIDES[normalized];
    }
  }
  return null;
}
