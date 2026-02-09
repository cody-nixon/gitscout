import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SkillSelector } from "@/components/SkillSelector";
import { IssueCard } from "@/components/IssueCard";
import { Settings } from "@/components/Settings";
import { searchIssues, getRepoInfo, type GitHubIssue } from "@/lib/github";
import { analyzeIssues, type IssueAnalysis } from "@/lib/ai";
import {
  loadSkills, saveSkills,
  loadGithubToken, saveGithubToken,
  loadOpenRouterKey, saveOpenRouterKey,
  loadBookmarks, saveBookmarks,
  loadTheme, saveTheme,
} from "@/lib/storage";
import {
  Search, Loader2, Moon, Sun, Telescope, ArrowDown,
  Sparkles, Filter, RefreshCw, Github,
} from "lucide-react";

type SortOption = "match" | "freshness" | "complexity" | "stars";
type FilterComplexity = "all" | "easy" | "medium" | "hard";

export default function App() {
  const [skills, setSkills] = useState<string[]>(loadSkills);
  const [githubToken, setGithubToken] = useState(loadGithubToken);
  const [openrouterKey, setOpenrouterKey] = useState(loadOpenRouterKey);
  const [bookmarks, setBookmarks] = useState<number[]>(loadBookmarks);
  const [theme, setTheme] = useState<"dark" | "light">(loadTheme);
  
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [analyses, setAnalyses] = useState<Map<number, IssueAnalysis>>(new Map());
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  
  const [sortBy, setSortBy] = useState<SortOption>("match");
  const [filterComplexity, setFilterComplexity] = useState<FilterComplexity>("all");
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // Theme management
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    saveTheme(theme);
  }, [theme]);

  // Save skills on change
  useEffect(() => { saveSkills(skills); }, [skills]);

  const toggleBookmark = useCallback((id: number) => {
    setBookmarks((prev) => {
      const next = prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id];
      saveBookmarks(next);
      return next;
    });
  }, []);

  const handleSearch = async () => {
    if (skills.length === 0) {
      setError("Select at least one skill to search");
      return;
    }
    
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setAnalyses(new Map());

    try {
      const result = await searchIssues(skills, {
        token: githubToken || undefined,
        perPage: 30,
      });
      
      setTotalCount(result.total_count);
      
      // Enrich with repo info (first 10 to save API calls)
      const enriched = await Promise.all(
        result.items.slice(0, 20).map(async (issue) => {
          try {
            const repo = await getRepoInfo(issue.repository_url, githubToken || undefined);
            return { ...issue, repo };
          } catch {
            return issue;
          }
        })
      );
      
      setIssues(enriched);
      setLoading(false);

      // Run AI analysis if key is available
      if (openrouterKey) {
        setAnalyzing(true);
        try {
          const analysisMap = await analyzeIssues(enriched, skills, openrouterKey);
          setAnalyses(analysisMap);
        } catch (err) {
          console.error("AI analysis failed:", err);
        }
        setAnalyzing(false);
      }
    } catch (err: any) {
      setError(err.message || "Search failed");
      setLoading(false);
    }
  };

  // Sort and filter
  const filteredIssues = issues
    .filter((issue) => {
      if (showBookmarksOnly && !bookmarks.includes(issue.id)) return false;
      if (filterComplexity !== "all") {
        const a = analyses.get(issue.id);
        if (!a) return true; // show if no analysis yet
        if (filterComplexity === "easy" && a.complexity > 2) return false;
        if (filterComplexity === "medium" && (a.complexity < 3 || a.complexity > 3)) return false;
        if (filterComplexity === "hard" && a.complexity < 4) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const aa = analyses.get(a.id);
      const ab = analyses.get(b.id);
      switch (sortBy) {
        case "match":
          return (ab?.skillMatch ?? 0) - (aa?.skillMatch ?? 0);
        case "freshness":
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        case "complexity":
          return (aa?.complexity ?? 3) - (ab?.complexity ?? 3);
        case "stars":
          return (b.repo?.stargazers_count ?? 0) - (a.repo?.stargazers_count ?? 0);
        default:
          return 0;
      }
    });

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark bg-zinc-950" : "bg-white"}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <Telescope className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-100">GitScout</h1>
              <p className="text-sm text-zinc-500">Find your first open source contribution</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Settings
              githubToken={githubToken}
              openrouterKey={openrouterKey}
              onSaveGithubToken={(t) => { setGithubToken(t); saveGithubToken(t); }}
              onSaveOpenRouterKey={(k) => { setOpenrouterKey(k); saveOpenRouterKey(k); }}
            />
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-white"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </header>

        {/* Hero / Skill Selection */}
        {!hasSearched && (
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-zinc-100 mb-3">
              What do you <span className="text-emerald-400">know</span>?
            </h2>
            <p className="text-lg text-zinc-400 max-w-xl mx-auto">
              Select your skills and we'll find open source issues that match.
              {!openrouterKey && (
                <span className="block text-sm text-zinc-600 mt-1">
                  Add an OpenRouter key in Settings for AI-powered complexity & match analysis
                </span>
              )}
            </p>
          </div>
        )}

        <div className="mb-6">
          <SkillSelector selected={skills} onChange={setSkills} />
        </div>

        <div className="flex items-center gap-3 mb-8">
          <Button
            onClick={handleSearch}
            disabled={loading || skills.length === 0}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            size="lg"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Search className="w-4 h-4 mr-2" />
            )}
            {loading ? "Searching..." : "Scout Issues"}
          </Button>
          
          {hasSearched && (
            <Button
              onClick={handleSearch}
              variant="outline"
              size="lg"
              className="border-zinc-700 text-zinc-400"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          )}
          
          {analyzing && (
            <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
              <Sparkles className="w-3 h-3 mr-1 animate-pulse" />
              AI analyzing...
            </Badge>
          )}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Results */}
        {hasSearched && !loading && issues.length > 0 && (
          <>
            {/* Filters bar */}
            <div className="flex flex-wrap items-center gap-3 mb-4 pb-4 border-b border-zinc-800">
              <span className="text-sm text-zinc-500">
                {totalCount.toLocaleString()} issues found
              </span>
              
              <div className="flex items-center gap-1 ml-auto">
                <Filter className="w-3.5 h-3.5 text-zinc-600 mr-1" />
                
                {(["all", "easy", "medium", "hard"] as FilterComplexity[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilterComplexity(f)}
                    className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                      filterComplexity === f
                        ? "bg-zinc-700 text-zinc-200"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1">
                <ArrowDown className="w-3.5 h-3.5 text-zinc-600 mr-1" />
                {(["match", "freshness", "complexity", "stars"] as SortOption[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSortBy(s)}
                    className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                      sortBy === s
                        ? "bg-zinc-700 text-zinc-200"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
                className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                  showBookmarksOnly
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                ★ Saved ({bookmarks.length})
              </button>
            </div>

            <div className="space-y-3">
              {filteredIssues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  analysis={analyses.get(issue.id)}
                  isBookmarked={bookmarks.includes(issue.id)}
                  onToggleBookmark={toggleBookmark}
                />
              ))}
              
              {filteredIssues.length === 0 && (
                <p className="text-center text-zinc-500 py-8">
                  No issues match your current filters.
                </p>
              )}
            </div>
          </>
        )}

        {hasSearched && !loading && issues.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-zinc-400 text-lg">No issues found for those skills.</p>
            <p className="text-zinc-600 text-sm mt-1">Try broader skills like "JavaScript" or "Python".</p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-6 border-t border-zinc-800 text-center">
          <p className="text-xs text-zinc-600">
            GitScout — Built by{" "}
            <a href="https://github.com/cody-nixon" className="text-zinc-400 hover:text-white">
              Cody Nixon
            </a>
            {" · "}
            <a href="https://github.com/cody-nixon/gitscout" className="text-zinc-400 hover:text-white inline-flex items-center gap-1">
              <Github className="w-3 h-3" /> Source
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
