import { notFound } from "next/navigation";
import ProjectDetailPageClient from "./ProjectDetailPageClient";
import { getAllProjects, getProjectById } from "@/utils/markdown";
import type { ProjectDetail } from "@/types/notion";

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ id: project.id }));
}

function getProject(id: string): ProjectDetail | null {
  const projectData = getProjectById(id);

  if (!projectData) {
    return null;
  }

  return {
    id: projectData.id,
    title: projectData.title,
    description: projectData.description,
    category: projectData.category,
    tags: projectData.tags,
    images: projectData.images || [],
    link: projectData.link || "#",
    year: projectData.year,
    partner: projectData.partner || "",
    date: projectData.date || "",
    selection: projectData.selection || [],
    content: projectData.content,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProject(id);

  if (!project) {
    notFound();
  }

  return <ProjectDetailPageClient project={project} />;
}
