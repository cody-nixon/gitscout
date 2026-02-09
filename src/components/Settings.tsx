import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings as SettingsIcon, Eye, EyeOff } from "lucide-react";

interface SettingsProps {
  githubToken: string;
  openrouterKey: string;
  onSaveGithubToken: (token: string) => void;
  onSaveOpenRouterKey: (key: string) => void;
}

export function Settings({
  githubToken,
  openrouterKey,
  onSaveGithubToken,
  onSaveOpenRouterKey,
}: SettingsProps) {
  const [localToken, setLocalToken] = useState(githubToken);
  const [localKey, setLocalKey] = useState(openrouterKey);
  const [showToken, setShowToken] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [open, setOpen] = useState(false);

  const save = () => {
    onSaveGithubToken(localToken);
    onSaveOpenRouterKey(localKey);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
          <SettingsIcon className="w-4 h-4 mr-1" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-800 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-zinc-100">Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <label className="text-sm font-medium text-zinc-300 mb-1.5 block">
              GitHub Token <span className="text-zinc-600">(optional — higher rate limits)</span>
            </label>
            <div className="relative">
              <Input
                type={showToken ? "text" : "password"}
                value={localToken}
                onChange={(e) => setLocalToken(e.target.value)}
                placeholder="ghp_..."
                className="bg-zinc-800 border-zinc-700 pr-10"
              />
              <button
                onClick={() => setShowToken(!showToken)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-zinc-600 mt-1">
              Create at github.com/settings/tokens (no scopes needed for public repos)
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-300 mb-1.5 block">
              OpenRouter API Key <span className="text-zinc-600">(enables AI analysis)</span>
            </label>
            <div className="relative">
              <Input
                type={showKey ? "text" : "password"}
                value={localKey}
                onChange={(e) => setLocalKey(e.target.value)}
                placeholder="sk-or-..."
                className="bg-zinc-800 border-zinc-700 pr-10"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-zinc-600 mt-1">
              Get one at openrouter.ai/keys — enables complexity & skill match analysis
            </p>
          </div>

          <Button onClick={save} className="w-full">
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
