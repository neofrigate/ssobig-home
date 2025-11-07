import { NextResponse } from "next/server";
import axios from "axios";

export const dynamic = 'force-dynamic';

// Notion API 타입 정의
interface RichText {
  plain_text: string;
  [key: string]: unknown;
}

interface NotionBlock {
  type: string;
  paragraph?: { rich_text: RichText[] };
  heading_1?: { rich_text: RichText[] };
  heading_2?: { rich_text: RichText[] };
  heading_3?: { rich_text: RichText[] };
  bulleted_list_item?: { rich_text: RichText[] };
  numbered_list_item?: { rich_text: RichText[] };
  quote?: { rich_text: RichText[] };
  code?: { rich_text: RichText[] };
  video?: { type: string; external?: { url: string } };
  embed?: { url: string };
  bookmark?: { url: string };
  [key: string]: unknown;
}

interface NotionProperty {
  type: string;
  title?: RichText[];
  rich_text?: RichText[];
  select?: { name: string };
  multi_select?: Array<{ name: string }>;
  files?: Array<{
    type: string;
    external?: { url: string };
    file?: { url: string };
  }>;
  url?: string;
  date?: { start: string };
  [key: string]: unknown;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // params를 await로 unwrap
    const resolvedParams = await params;
    const pageId = resolvedParams.id;
    
    // 환경 변수 확인
    const apiKey = process.env.NOTION_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "NOTION_API_KEY가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    if (!pageId) {
      return NextResponse.json(
        { error: "프로젝트 ID가 필요합니다." },
        { status: 400 }
      );
    }

    console.log("프로젝트 ID:", pageId);

    // Notion 페이지 가져오기
    const url = `https://api.notion.com/v1/pages/${pageId}`;
    
    const https = await import('https');
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });
    
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
      },
      httpsAgent,
    });

    const page = response.data;
    const props = page.properties || {};

    // 페이지 본문(Blocks) 가져오기
    const blocksUrl = `https://api.notion.com/v1/blocks/${pageId}/children`;
    const blocksResponse = await axios.get(blocksUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
      },
      httpsAgent,
    });

    const blocks = blocksResponse.data.results || [];
    console.log("블록 개수:", blocks.length);

    // 블록을 텍스트로 변환
    const getBlockText = (block: NotionBlock): string => {
      if (!block) return "";
      
      const type = block.type;
      
      // 텍스트 추출 헬퍼
      const getRichText = (richTexts: RichText[]) => {
        if (!richTexts || richTexts.length === 0) return "";
        return richTexts.map((rt) => rt.plain_text || "").join("");
      };

      switch (type) {
        case "paragraph":
          return getRichText(block.paragraph?.rich_text);
        case "heading_1":
          return "# " + getRichText(block.heading_1?.rich_text);
        case "heading_2":
          return "## " + getRichText(block.heading_2?.rich_text);
        case "heading_3":
          return "### " + getRichText(block.heading_3?.rich_text);
        case "bulleted_list_item":
          return "• " + getRichText(block.bulleted_list_item?.rich_text);
        case "numbered_list_item":
          return "1. " + getRichText(block.numbered_list_item?.rich_text);
        case "quote":
          return "> " + getRichText(block.quote?.rich_text);
        case "code":
          return "```\n" + getRichText(block.code?.rich_text) + "\n```";
        case "divider":
          return "---";
        case "video":
          // 비디오 블록 (유튜브 등)
          if (block.video?.type === "external") {
            return "[VIDEO]" + block.video.external.url;
          }
          return "";
        case "embed":
          // Embed 블록 (유튜브, 기타 embed)
          return "[EMBED]" + block.embed?.url || "";
        case "bookmark":
          // 북마크 블록
          return "[LINK]" + block.bookmark?.url || "";
        default:
          console.log("처리되지 않은 블록 타입:", type);
          return "";
      }
    };

    // 모든 블록을 텍스트로 변환
    const contentText = blocks
      .map((block: NotionBlock) => getBlockText(block))
      .filter((text: string) => text.length > 0)
      .join("\n\n");

    console.log("변환된 본문 길이:", contentText.length);

    // 프로젝트 데이터 변환
    const getTitle = (prop: NotionProperty) => {
      if (prop?.type === "title" && prop.title?.[0]) {
        return prop.title[0].plain_text || "";
      }
      return "";
    };

    const getRichText = (prop: NotionProperty) => {
      if (prop?.type === "rich_text" && prop.rich_text?.[0]) {
        return prop.rich_text[0].plain_text || "";
      }
      return "";
    };

    const getSelect = (prop: NotionProperty) => {
      if (prop?.type === "select" && prop.select) {
        return prop.select.name || "";
      }
      return "";
    };

    const getMultiSelect = (prop: NotionProperty) => {
      if (prop?.type === "multi_select" && prop.multi_select) {
        return prop.multi_select.map((item) => item.name);
      }
      return [];
    };

    const getFiles = (prop: NotionProperty) => {
      if (prop?.type === "files" && prop.files) {
        return prop.files.map((file) => {
          if (file.type === "external") return file.external?.url || "";
          if (file.type === "file") return file.file?.url || "";
          return "";
        }).filter((url: string) => url);
      }
      return [];
    };

    const getUrl = (prop: NotionProperty) => {
      if (prop?.type === "url" && prop.url) {
        return prop.url;
      }
      return "";
    };

    const getDate = (prop: NotionProperty) => {
      if (prop?.type === "date" && prop.date) {
        return prop.date.start || "";
      }
      return "";
    };

    // 모든 이미지 파일 가져오기 (썸네일 + 이미지 필드)
    const thumbnailFiles = getFiles(props["썸네일"] || props["Thumbnail"]);
    const imageFiles = getFiles(props["이미지"] || props["Image"]);
    const allImages = [...thumbnailFiles, ...imageFiles].filter(url => url && url !== "#");

    const project = {
      id: page.id,
      title: getTitle(props["제목"] || props["이름"] || props["Title"] || props["Name"]),
      description: getRichText(props["설명"] || props["Description"] || props["부제"]),
      category: getSelect(props["카테고리"] || props["Category"]),
      tags: getMultiSelect(props["태그"] || props["Tags"]),
      images: allImages.length > 0 ? allImages : [],
      link: getUrl(props["링크"] || props["Link"]),
      year: getRichText(props["연도"] || props["Year"]),
      partner: getRichText(props["파트너"] || props["Partner"]),
      date: getDate(props["날짜"] || props["Date"]),
      selection: getMultiSelect(props["선택"] || props["Selection"]),
      content: contentText, // 페이지 본문 추가
    };

    console.log("변환된 프로젝트:", project.title);

    return NextResponse.json({ project });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류";
    const responseData = axios.isAxiosError(error) ? error.response?.data : undefined;
    
    console.error("API 오류:", error);
    console.error("오류 메시지:", errorMessage);
    console.error("응답 데이터:", responseData);
    
    return NextResponse.json(
      {
        error: "프로젝트를 가져오는 중 오류가 발생했습니다.",
        details: errorMessage,
        notionError: responseData,
      },
      { status: 500 }
    );
  }
}

