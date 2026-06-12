import ProjectPageClient from "./ProjectPageClient";
import { getAllProjects } from "@/utils/markdown";
import type { NotionProject } from "@/types/notion";

function getProjects(): NotionProject[] {
  return getAllProjects().map((project) => ({
    id: project.id,
    title: project.title,
    description: project.description,
    category: project.category,
    tags: project.tags,
    image: project.thumbnail || "",
    link: project.link || "#",
    year: project.year,
  }));
}

export default function ProjectPage() {
  return <ProjectPageClient initialProjects={getProjects()} />;
}
