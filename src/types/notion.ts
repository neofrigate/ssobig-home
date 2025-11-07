// Notion 프로젝트 타입 정의
export interface NotionProject {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  image: string;
  link: string;
  year: string;
}

// Notion API 응답 타입
export interface NotionDatabaseResponse {
  results: NotionPage[];
  has_more: boolean;
  next_cursor: string | null;
}

export interface NotionPage {
  id: string;
  properties: {
    [key: string]: NotionProperty;
  };
}

export type NotionProperty =
  | { type: "title"; title: NotionRichText[] }
  | { type: "rich_text"; rich_text: NotionRichText[] }
  | { type: "select"; select: { name: string } | null }
  | { type: "multi_select"; multi_select: { name: string }[] }
  | { type: "files"; files: NotionFile[] }
  | { type: "url"; url: string | null }
  | { type: "number"; number: number | null };

export interface NotionRichText {
  plain_text: string;
}

export interface NotionFile {
  type: "external" | "file";
  name: string;
  external?: {
    url: string;
  };
  file?: {
    url: string;
  };
}


