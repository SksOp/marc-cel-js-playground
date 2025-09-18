'use client';

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
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

  const handleRefresh = () => {
    loadVersionsList();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label htmlFor="version-select" className="text-sm font-medium">
          CEL-JS Version:
        </label>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoadingVersions}
        >
          {isLoadingVersions ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </div>

      <Select
        value={selectedVersion}
        onValueChange={handleVersionSelect}
        disabled={isLoadingVersions || isLoading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a version..." />
        </SelectTrigger>
        <SelectContent>
          {availableVersions.map((version) => (
            <SelectItem key={version} value={version}>
              <div className="flex items-center gap-2">
                <span>{version}</span>
                {version === latestVersion && (
                  <span className="text-xs text-muted-foreground">
                    (latest)
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading CEL-JS...
        </div>
      )}
    </div>
  );
}
