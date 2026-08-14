import projectsData from "@/data/projects.json";
import newsData from "@/data/news.json";
import wordsData from "@/data/words.json";

export interface ProjectRole {
  title: string;
  active: boolean;
}

export interface Project {
  slug: string;
  name: string;
  altCardTitle: string | null;
  featured: boolean;
  date: string | null;
  type: string | null;
  link: string | null;
  linkExplainer: string | null;
  ogImage: string | null;
  mainImage: string | null;
  mainImageAlt: string | null;
  bgColor: string | null;
  bgType: "Light" | "Dark" | null;
  metaDescription: string | null;
  summary: string | null;
  roles: ProjectRole[];
  problem: string | null;
  solution: string | null;
  body: string | null;
}

export interface NewsItem {
  slug: string;
  name: string;
  date: string | null;
  action: "Video" | "Article" | "Podcast" | null;
  link: string | null;
  image: string | null;
}

export interface Word {
  slug: string;
  name: string;
  date: string | null;
  category: string | null;
  shortDescription: string | null;
  body: string | null;
  readTime: number;
}

/** All projects, newest first. */
export const projects = projectsData as Project[];

/** Projects flagged as featured, newest first. Shown on the home page. */
export const featuredProjects = projects.filter((p) => p.featured);

/** News mentions, newest first. Shown on the info page. */
export const news = newsData as NewsItem[];

/** Blog posts, newest first. */
export const words = wordsData as Word[];

/** The year of a CMS date string, e.g. "2023". */
export const yearOf = (date: string | null | undefined) =>
  date ? new Date(date).getUTCFullYear().toString() : "";

/** A card title: the shorter alternate when set, else the name. */
export const cardTitle = (p: Project) => p.altCardTitle ?? p.name;
