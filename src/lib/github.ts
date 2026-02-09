export interface GitHubIssue {
  id: number;
  title: string;
  body: string | null;
  html_url: string;
  created_at: string;
  updated_at: string;
  labels: Array<{ name: string; color: string }>;
  user: { login: string; avatar_url: string } | null;
  comments: number;
  repository_url: string;
  repo?: RepoInfo;
}

export interface RepoInfo {
  full_name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  open_issues_count: number;
  html_url: string;
  topics: string[];
  has_wiki: boolean;
  license: { name: string } | null;
}

export interface SearchResult {
  total_count: number;
  items: GitHubIssue[];
}

const GITHUB_API = "https://api.github.com";

function getHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };
  if (token) {
    headers.Authorization = `token ${token}`;
  }
  return headers;
}

export async function searchIssues(
  skills: string[],
  options: {
    token?: string;
    sort?: "created" | "updated" | "comments";
    perPage?: number;
    page?: number;
  } = {}
): Promise<SearchResult> {
  const { token, sort = "created", perPage = 30, page = 1 } = options;
  
  // Build query with skills as language filters
  const languageFilter = skills
    .map((s) => `language:${s.toLowerCase()}`)
    .join(" ");
  
  const query = `label:"good first issue" is:open is:issue ${languageFilter} sort:${sort}`;
  
  const url = `${GITHUB_API}/search/issues?q=${encodeURIComponent(query)}&sort=${sort}&order=desc&per_page=${perPage}&page=${page}`;
  
  const res = await fetch(url, { headers: getHeaders(token) });
  
  if (!res.ok) {
    if (res.status === 403) {
      throw new Error("GitHub API rate limit exceeded. Add a GitHub token for higher limits.");
    }
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }
  
  return res.json();
}

export async function getRepoInfo(
  repoUrl: string,
  token?: string
): Promise<RepoInfo> {
  // repoUrl looks like https://api.github.com/repos/owner/name
  const res = await fetch(repoUrl, { headers: getHeaders(token) });
  if (!res.ok) {
    throw new Error(`Failed to fetch repo info: ${res.status}`);
  }
  return res.json();
}

export function getRelativeTime(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks}w ago`;
  return `${months}mo ago`;
}

export function getFreshnessScore(updatedAt: string): number {
  const days = (Date.now() - new Date(updatedAt).getTime()) / 86400000;
  if (days < 3) return 5;
  if (days < 7) return 4;
  if (days < 14) return 3;
  if (days < 30) return 2;
  return 1;
}
