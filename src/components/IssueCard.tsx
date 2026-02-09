import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  Clock,
  MessageSquare,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Zap,
  Brain,
  Timer,
} from "lucide-react";
import type { GitHubIssue } from "@/lib/github";
import type { IssueAnalysis } from "@/lib/ai";
import { getRelativeTime, getFreshnessScore } from "@/lib/github";

interface IssueCardProps {
  issue: GitHubIssue;
  analysis?: IssueAnalysis;
  isBookmarked: boolean;
  onToggleBookmark: (id: number) => void;
}

function ComplexityBadge({ level }: { level: number }) {
  const configs: Record<number, { label: string; className: string }> = {
    1: { label: "Trivial", className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
    2: { label: "Easy", className: "bg-green-500/20 text-green-400 border-green-500/30" },
    3: { label: "Medium", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
    4: { label: "Hard", className: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
    5: { label: "Expert", className: "bg-red-500/20 text-red-400 border-red-500/30" },
  };
  const config = configs[level] || configs[3];
  return (
    <Badge variant="outline" className={config.className}>
      <Brain className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
}

function FreshnessDots({ score }: { score: number }) {
  return (
    <div className="flex gap-0.5 items-center" title={`Freshness: ${score}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${
            i <= score ? "bg-green-400" : "bg-zinc-700"
          }`}
        />
      ))}
    </div>
  );
}

function MatchBar({ percent }: { percent: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${
            percent >= 70
              ? "bg-green-400"
              : percent >= 40
              ? "bg-yellow-400"
              : "bg-zinc-600"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-xs text-zinc-500">{percent}% match</span>
    </div>
  );
}

export function IssueCard({ issue, analysis, isBookmarked, onToggleBookmark }: IssueCardProps) {
  const repoName = issue.repository_url?.split("/repos/")[1] || "unknown/repo";
  const freshness = getFreshnessScore(issue.updated_at);

  return (
    <Card className="bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 transition-all group">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <a
                href={`https://github.com/${repoName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors truncate"
              >
                {repoName}
              </a>
              <FreshnessDots score={freshness} />
            </div>

            <a
              href={issue.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-semibold text-zinc-100 hover:text-white transition-colors line-clamp-2 leading-snug"
            >
              {issue.title}
            </a>

            {analysis?.summary && (
              <p className="text-sm text-zinc-400 mt-2 line-clamp-2">
                {analysis.summary}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 mt-3">
              {analysis && (
                <>
                  <ComplexityBadge level={analysis.complexity} />
                  <MatchBar percent={analysis.skillMatch} />
                </>
              )}
              
              {!analysis && (
                <div className="flex flex-wrap gap-1.5">
                  {issue.labels.slice(0, 4).map((label) => (
                    <Badge
                      key={label.name}
                      variant="outline"
                      className="text-xs border-zinc-700 text-zinc-400"
                    >
                      {label.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {analysis?.requiredSkills && analysis.requiredSkills.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {analysis.requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-1.5 py-0.5 bg-zinc-800 text-zinc-500 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 mt-3 text-xs text-zinc-600">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {getRelativeTime(issue.created_at)}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                {issue.comments}
              </span>
              {issue.repo && (
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {issue.repo.stargazers_count.toLocaleString()}
                </span>
              )}
              {analysis?.estimatedHours && (
                <span className="flex items-center gap-1">
                  <Timer className="w-3 h-3" />
                  {analysis.estimatedHours}
                </span>
              )}
              {analysis?.beginnerFriendly && (
                <span className="flex items-center gap-1 text-emerald-500">
                  <Zap className="w-3 h-3" />
                  Beginner friendly
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-zinc-500 hover:text-white"
              onClick={() => onToggleBookmark(issue.id)}
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4 text-yellow-400" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </Button>
            <a
              href={issue.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-zinc-500 hover:text-white"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
