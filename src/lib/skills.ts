export const POPULAR_SKILLS = [
  // Languages
  "JavaScript", "TypeScript", "Python", "Java", "Go", "Rust",
  "C++", "C#", "Ruby", "PHP", "Swift", "Kotlin",
  // Frontend
  "React", "Vue", "Angular", "Svelte", "Next.js",
  // Backend
  "Node.js", "Django", "Flask", "Spring", "Express",
  // Other
  "Docker", "Kubernetes", "GraphQL", "PostgreSQL", "MongoDB",
  "Tailwind", "CSS", "HTML",
] as const;

export const SKILL_COLORS: Record<string, string> = {
  JavaScript: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  TypeScript: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Python: "bg-green-500/20 text-green-400 border-green-500/30",
  Java: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Go: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Rust: "bg-red-500/20 text-red-400 border-red-500/30",
  "C++": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "C#": "bg-violet-500/20 text-violet-400 border-violet-500/30",
  Ruby: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  PHP: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  React: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  Vue: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

export function getSkillColor(skill: string): string {
  return SKILL_COLORS[skill] || "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
}
