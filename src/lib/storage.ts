const KEYS = {
  skills: "gitscout_skills",
  githubToken: "gitscout_github_token",
  openrouterKey: "gitscout_openrouter_key",
  bookmarks: "gitscout_bookmarks",
  theme: "gitscout_theme",
};

export function loadSkills(): string[] {
  try {
    const raw = localStorage.getItem(KEYS.skills);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSkills(skills: string[]) {
  localStorage.setItem(KEYS.skills, JSON.stringify(skills));
}

export function loadGithubToken(): string {
  return localStorage.getItem(KEYS.githubToken) || "";
}

export function saveGithubToken(token: string) {
  localStorage.setItem(KEYS.githubToken, token);
}

export function loadOpenRouterKey(): string {
  return localStorage.getItem(KEYS.openrouterKey) || "";
}

export function saveOpenRouterKey(key: string) {
  localStorage.setItem(KEYS.openrouterKey, key);
}

export function loadBookmarks(): number[] {
  try {
    const raw = localStorage.getItem(KEYS.bookmarks);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveBookmarks(bookmarks: number[]) {
  localStorage.setItem(KEYS.bookmarks, JSON.stringify(bookmarks));
}

export function loadTheme(): "dark" | "light" {
  return (localStorage.getItem(KEYS.theme) as "dark" | "light") || "dark";
}

export function saveTheme(theme: "dark" | "light") {
  localStorage.setItem(KEYS.theme, theme);
}
