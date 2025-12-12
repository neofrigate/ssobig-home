import fs from "fs";
import path from "path";
import matter from "gray-matter";
import yaml from "js-yaml";

export interface ProjectMetadata {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  year: string;
  date?: string;
  partner?: string;
  thumbnail?: string;
  images?: string[];
  link?: string;
  selection?: string[];
  status?: string;
  contentPath?: string;
}

export interface ProjectData extends ProjectMetadata {
  content: string;
}

const projectsDirectory = path.join(process.cwd(), "content/projects");

/**
 * 모든 프로젝트 파일 이름 가져오기
 * YAML 파일 우선, 없으면 MD 파일 반환 (하위 호환성)
 */
export function getProjectFiles(): string[] {
  if (!fs.existsSync(projectsDirectory)) {
    console.warn("Projects directory does not exist:", projectsDirectory);
    return [];
  }

  const files = fs.readdirSync(projectsDirectory);
  const yamlFiles = files.filter((file) => file.endsWith(".yml"));
  const mdFiles = files.filter((file) => file.endsWith(".md"));
  
  // YAML 파일이 있으면 YAML 파일 ID 반환, 없으면 MD 파일 반환
  const projectIds = new Set<string>();
  
  // YAML 파일에서 ID 추출
  yamlFiles.forEach((file) => {
    const id = file.replace(/\.yml$/, "");
    projectIds.add(id);
  });
  
  // YAML 파일이 없는 MD 파일만 추가 (하위 호환성)
  mdFiles.forEach((file) => {
    const id = file.replace(/\.md$/, "");
    if (!projectIds.has(id)) {
      projectIds.add(id);
    }
  });
  
  return Array.from(projectIds);
}

/**
 * 특정 프로젝트 데이터 가져오기 (ID 또는 파일명으로)
 * YAML 파일이 있으면 우선 로드하고, contentPath로 지정된 MD 파일을 별도로 로드
 * YAML 파일이 없으면 기존 방식(frontmatter 파싱)으로 처리 (하위 호환성)
 */
export function getProjectById(id: string): ProjectData | null {
  try {
    // ID 정규화 (.md, .yml 확장자 제거)
    const normalizedId = id.replace(/\.(md|yml)$/, "");
    
    // 먼저 YAML 파일 확인
    const yamlPath = path.join(projectsDirectory, `${normalizedId}.yml`);
    const mdPath = path.join(projectsDirectory, `${normalizedId}.md`);
    
    let metadata: ProjectMetadata;
    let content: string;
    
    if (fs.existsSync(yamlPath)) {
      // YAML 파일이 있는 경우: YAML에서 메타데이터 로드, contentPath로 MD 파일 로드
      if (process.env.NODE_ENV === "development") {
        const stats = fs.statSync(yamlPath);
        console.log(
          `[DEV] Loading project from YAML: ${normalizedId}.yml (modified: ${stats.mtime})`
        );
      }
      
      const yamlContent = fs.readFileSync(yamlPath, "utf8");
      const yamlData = yaml.load(yamlContent) as any;
      
      // 메타데이터 검증 및 기본값 설정
      metadata = {
        id: yamlData.id || normalizedId,
        title: yamlData.title || "Untitled",
        description: yamlData.description || "",
        category: yamlData.category || "기타",
        tags: Array.isArray(yamlData.tags) ? yamlData.tags : [],
        year: yamlData.year || new Date().getFullYear().toString(),
        date: yamlData.date || "",
        partner: yamlData.partner || "",
        thumbnail: yamlData.thumbnail || "",
        images: Array.isArray(yamlData.images) ? yamlData.images : [],
        link: yamlData.link || "#",
        selection: Array.isArray(yamlData.selection) ? yamlData.selection : [],
        status: yamlData.status || "draft",
        contentPath: yamlData.contentPath || `${normalizedId}.md`,
      };
      
      // contentPath로 지정된 MD 파일 로드
      const contentFilePath = path.join(projectsDirectory, metadata.contentPath!);
      if (fs.existsSync(contentFilePath)) {
        content = fs.readFileSync(contentFilePath, "utf8").trim();
      } else {
        console.warn(`Content file not found: ${metadata.contentPath}`);
        content = "";
      }
    } else if (fs.existsSync(mdPath)) {
      // YAML 파일이 없는 경우: 기존 방식(frontmatter 파싱)으로 처리 (하위 호환성)
      if (process.env.NODE_ENV === "development") {
        const stats = fs.statSync(mdPath);
        console.log(
          `[DEV] Loading project file (legacy): ${normalizedId}.md (modified: ${stats.mtime})`
        );
      }
      
      const fileContents = fs.readFileSync(mdPath, "utf8");
      const { data, content: mdContent } = matter(fileContents);
      
      // 메타데이터 검증 및 기본값 설정
      metadata = {
        id: data.id || normalizedId,
        title: data.title || "Untitled",
        description: data.description || "",
        category: data.category || "기타",
        tags: Array.isArray(data.tags) ? data.tags : [],
        year: data.year || new Date().getFullYear().toString(),
        date: data.date || "",
        partner: data.partner || "",
        thumbnail: data.thumbnail || "",
        images: Array.isArray(data.images) ? data.images : [],
        link: data.link || "#",
        selection: Array.isArray(data.selection) ? data.selection : [],
        status: data.status || "draft",
      };
      
      content = mdContent.trim();
    } else {
      console.warn(`Project file not found: ${normalizedId} (checked .yml and .md)`);
      return null;
    }

    return {
      ...metadata,
      content,
    };
  } catch (error) {
    console.error("Error reading project file:", id, error);
    return null;
  }
}

/**
 * 모든 프로젝트 메타데이터 가져오기 (published 상태만)
 */
export function getAllProjects(): ProjectMetadata[] {
  const projectIds = getProjectFiles();

  const projects = projectIds
    .map((id) => {
      const project = getProjectById(id);

      if (!project) return null;

      // 본문 제외하고 메타데이터만 반환
      const { content, ...metadata } = project;
      return metadata;
    })
    .filter((project): project is ProjectMetadata => project !== null)
    .filter((project) => project.status === "published") // published 상태만
    .sort((a, b) => {
      // 날짜 기준 내림차순 정렬 (최신순)
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });

  return projects;
}

/**
 * 카테고리별 프로젝트 가져오기
 */
export function getProjectsByCategory(category: string): ProjectMetadata[] {
  const allProjects = getAllProjects();
  return allProjects.filter((project) => project.category === category);
}

/**
 * 모든 카테고리 목록 가져오기
 */
export function getAllCategories(): string[] {
  const projects = getAllProjects();
  const categories = new Set(projects.map((project) => project.category));
  return Array.from(categories).sort();
}

