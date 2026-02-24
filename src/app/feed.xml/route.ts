import { getAllProjects } from "@/utils/markdown";

export async function GET() {
  const projects = getAllProjects();

  const items = projects
    .map((project) => {
      const link = `https://www.ssobig.com/project/${project.id}`;
      const pubDate = project.date
        ? new Date(project.date).toUTCString()
        : new Date().toUTCString();

      return `    <item>
      <title><![CDATA[${project.title}]]></title>
      <link>${link}</link>
      <guid>${link}</guid>
      <description><![CDATA[${project.description}]]></description>
      <category>${project.category}</category>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>쏘빅 SSOBIG</title>
    <link>https://www.ssobig.com</link>
    <description>술 없이도 즐거운 소셜 플랫폼 쏘빅! 머더미스터리, 추리게임, 보드게임, 소셜링 등 다양한 콘텐츠를 만나보세요.</description>
    <language>ko</language>
    <atom:link href="https://www.ssobig.com/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
