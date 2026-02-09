import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { POPULAR_SKILLS, getSkillColor } from "@/lib/skills";
import { X, Plus } from "lucide-react";

interface SkillSelectorProps {
  selected: string[];
  onChange: (skills: string[]) => void;
}

export function SkillSelector({ selected, onChange }: SkillSelectorProps) {
  const [custom, setCustom] = useState("");

  const toggle = (skill: string) => {
    if (selected.includes(skill)) {
      onChange(selected.filter((s) => s !== skill));
    } else {
      onChange([...selected, skill]);
    }
  };

  const addCustom = () => {
    const trimmed = custom.trim();
    if (trimmed && !selected.includes(trimmed)) {
      onChange([...selected, trimmed]);
      setCustom("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {POPULAR_SKILLS.map((skill) => {
          const isSelected = selected.includes(skill);
          return (
            <button
              key={skill}
              onClick={() => toggle(skill)}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium border transition-all cursor-pointer
                ${isSelected
                  ? getSkillColor(skill) + " ring-1 ring-white/20"
                  : "bg-zinc-800/50 text-zinc-500 border-zinc-700/50 hover:border-zinc-600 hover:text-zinc-300"
                }
              `}
            >
              {isSelected && <span className="mr-1">✓</span>}
              {skill}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2">
        <Input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCustom()}
          placeholder="Add custom skill..."
          className="max-w-xs bg-zinc-900 border-zinc-700"
        />
        <Button onClick={addCustom} variant="outline" size="sm" className="border-zinc-700">
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-800">
          <span className="text-xs text-zinc-500 self-center mr-1">Selected:</span>
          {selected.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className={`${getSkillColor(skill)} cursor-pointer`}
              onClick={() => toggle(skill)}
            >
              {skill} <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
