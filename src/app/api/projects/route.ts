import { NextResponse } from "next/server";
import axios from "axios";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 환경 변수 확인
    const apiKey = process.env.NOTION_API_KEY;
    const databaseId = process.env.NOTION_DATABASE_ID;

    console.log("API Key 존재:", !!apiKey);
    console.log("Database ID:", databaseId);

    if (!apiKey) {
      return NextResponse.json(
        { error: "NOTION_API_KEY가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    if (!databaseId) {
      return NextResponse.json(
        { error: "NOTION_DATABASE_ID가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    // Notion API 호출 (axios 사용)
    const url = `https://api.notion.com/v1/databases/${databaseId}/query`;
    console.log("Notion API 호출:", url);
    
    const https = await import('https');
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });
    
    const response = await axios.post(url, {
      filter: {
        property: "상태",
        status: {
          equals: "업로드"
        }
      }
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      httpsAgent,
    });

    const data = response.data;
    console.log("데이터 받음, 결과 개수:", data.results?.length || 0);

    // 프로젝트 데이터 변환
    const projects = data.results.map((page: any) => {
      const props = page.properties || {};

      const getTitle = (prop: any) => {
        if (prop?.type === "title" && prop.title?.[0]) {
          return prop.title[0].plain_text || "";
        }
        return "";
      };

      const getRichText = (prop: any) => {
        if (prop?.type === "rich_text" && prop.rich_text?.[0]) {
          return prop.rich_text[0].plain_text || "";
        }
        return "";
      };

      const getSelect = (prop: any) => {
        if (prop?.type === "select" && prop.select) {
          return prop.select.name || "";
        }
        return "";
      };

      const getMultiSelect = (prop: any) => {
        if (prop?.type === "multi_select" && prop.multi_select) {
          return prop.multi_select.map((item: any) => item.name);
        }
        return [];
      };

      const getFiles = (prop: any) => {
        if (prop?.type === "files" && prop.files?.[0]) {
          const file = prop.files[0];
          if (file.type === "external") return file.external?.url || "";
          if (file.type === "file") return file.file?.url || "";
        }
        return "";
      };

      const getUrl = (prop: any) => {
        if (prop?.type === "url" && prop.url) {
          return prop.url;
        }
        return "#";
      };

      // 썸네일 이미지 가져오기 (우선순위: 썸네일 > 이미지)
      const thumbnailProp = props["썸네일"] || props["Thumbnail"] || props["이미지"] || props["Image"];
      const thumbnailUrl = getFiles(thumbnailProp) || getUrl(props["이미지 URL"] || props["Image URL"]);

      const project = {
        id: page.id,
        title: getTitle(props["제목"] || props["Title"] || props["Name"] || props["이름"]),
        description: getRichText(props["설명"] || props["Description"] || props["부제"]),
        category: getSelect(props["카테고리"] || props["Category"]),
        tags: getMultiSelect(props["태그"] || props["Tags"]),
        image: thumbnailUrl,
        link: getUrl(props["링크"] || props["Link"]),
        year: getRichText(props["연도"] || props["Year"]),
      };

      console.log("변환된 프로젝트:", project.title || "(제목 없음)");
      return project;
    });

    console.log("총 프로젝트 수:", projects.length);

    return NextResponse.json({ projects });
  } catch (error: any) {
    console.error("API 오류:", error);
    console.error("오류 메시지:", error.message);
    console.error("응답 데이터:", error.response?.data);
    
    return NextResponse.json(
      {
        error: "프로젝트를 가져오는 중 오류가 발생했습니다.",
        details: error.message || "알 수 없는 오류",
        notionError: error.response?.data,
      },
      { status: 500 }
    );
  }
}
