import type { GitHubIssue } from "./github";

const OPENROUTER_API = "https://openrouter.ai/api/v1/chat/completions";

export interface IssueAnalysis {
  complexity: number; // 1-5
  skillMatch: number; // 0-100
  summary: string;
  requiredSkills: string[];
  estimatedHours: string;
  beginnerFriendly: boolean;
}

export async function analyzeIssues(
  issues: GitHubIssue[],
  userSkills: string[],
  apiKey: string
): Promise<Map<number, IssueAnalysis>> {
  const results = new Map<number, IssueAnalysis>();
  
  // Batch analyze up to 10 issues at once
  const batch = issues.slice(0, 10);
  
  const issueDescriptions = batch.map((issue, i) => {
    const repoName = issue.repository_url.split("/repos/")[1] || "unknown";
    const labels = issue.labels.map((l) => l.name).join(", ");
    return `Issue ${i + 1} (ID: ${issue.id}):
Title: ${issue.title}
Repo: ${repoName}
Labels: ${labels}
Comments: ${issue.comments}
Body: ${(issue.body || "No description").slice(0, 500)}`;
  });
  
  const prompt = `You are analyzing GitHub "good first issue" issues for a developer with these skills: ${userSkills.join(", ")}.

For each issue below, provide a JSON analysis. Be honest about complexity — some "good first issues" are actually hard.

${issueDescriptions.join("\n\n---\n\n")}

Respond with a JSON array where each element has:
- id: the issue ID number
- complexity: 1-5 (1=trivial, 2=easy, 3=medium, 4=hard, 5=expert)
- skillMatch: 0-100 (how well does this match the user's listed skills)
- summary: one-sentence plain english description of what needs to be done
- requiredSkills: array of specific tech skills needed
- estimatedHours: estimated time like "1-2 hours" or "4-8 hours"
- beginnerFriendly: true/false (is this genuinely approachable for someone learning?)`;

  try {
    const res = await fetch(OPENROUTER_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [{ role: "user", content: prompt }],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "issue_analysis",
            strict: true,
            schema: {
              type: "object",
              properties: {
                analyses: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "number" },
                      complexity: { type: "number" },
                      skillMatch: { type: "number" },
                      summary: { type: "string" },
                      requiredSkills: { type: "array", items: { type: "string" } },
                      estimatedHours: { type: "string" },
                      beginnerFriendly: { type: "boolean" },
                    },
                    required: ["id", "complexity", "skillMatch", "summary", "requiredSkills", "estimatedHours", "beginnerFriendly"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["analyses"],
              additionalProperties: false,
            },
          },
        },
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("OpenRouter error:", text);
      throw new Error(`AI analysis failed: ${res.status}`);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (content) {
      const parsed = JSON.parse(content);
      const analyses: (IssueAnalysis & { id: number })[] = parsed.analyses || parsed;
      
      for (const analysis of analyses as any[]) {
        results.set(analysis.id, {
          complexity: Math.min(5, Math.max(1, analysis.complexity)),
          skillMatch: Math.min(100, Math.max(0, analysis.skillMatch)),
          summary: analysis.summary,
          requiredSkills: analysis.requiredSkills,
          estimatedHours: analysis.estimatedHours,
          beginnerFriendly: analysis.beginnerFriendly,
        });
      }
    }
  } catch (err) {
    console.error("AI analysis error:", err);
    // Return empty results — the app still works without AI
  }
  
  return results;
}
