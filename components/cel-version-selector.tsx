'use client';

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Github, Loader2 } from 'lucide-react';
import { useCelService } from '@/hooks/use-cel-service';

interface CelVersionSelectorProps {
  onVersionChange: (version: string) => void;
  isLoading: boolean;
}

export function CelVersionSelector({
  onVersionChange,
  isLoading,
}: CelVersionSelectorProps) {
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [isLoadingVersions, setIsLoadingVersions] = useState(false);
  const { availableVersions, latestVersion, loadVersions } = useCelService();

  useEffect(() => {
    loadVersionsList();
  }, []);

  const loadVersionsList = async () => {
    setIsLoadingVersions(true);
    try {
      const { versions, latestVersion: latest } = await loadVersions();
      if (latest && !selectedVersion) {
        setSelectedVersion(latest);
        onVersionChange(latest);
      }
    } catch (error) {
      console.error('Failed to load versions:', error);
    } finally {
      setIsLoadingVersions(false);
    }
  };

  const handleVersionSelect = (version: string) => {
    setSelectedVersion(version);
    onVersionChange(version);
  };

  return (
    <div className="flex items-center gap-3">
      <a
        href="https://github.com/marcbachmann/cel-js"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Github className="h-4 w-4" />
        <span className="font-mono">marcbachmann/cel-js</span>
      </a>

      <Select
        value={selectedVersion}
        onValueChange={handleVersionSelect}
        disabled={isLoadingVersions || isLoading}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="v..." />
        </SelectTrigger>
        <SelectContent>
          {availableVersions.map((version) => (
            <SelectItem key={version} value={version}>
              <div className="flex items-center gap-2">
                <span>{version}</span>
                {version === latestVersion && (
                  <span className="text-xs text-muted-foreground">latest</span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isLoading && (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      )}
    </div>
  );
}
