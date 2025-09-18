'use client';

import { useState, useCallback } from 'react';

interface CelVersions {
  [version: string]: any;
}

interface NpmRegistryResponse {
  versions: CelVersions;
  'dist-tags': {
    latest: string;
  };
}

export function useCelService() {
  const [cel, setCel] = useState<any>(null);
  const [isVersionLoading, setIsVersionLoading] = useState(false);
  const [availableVersions, setAvailableVersions] = useState<string[]>([]);
  const [latestVersion, setLatestVersion] = useState<string>('');

  /** Fetch available versions from npm registry */
  const loadVersions = useCallback(async () => {
    const response = await fetch(
      'https://registry.npmjs.org/@marcbachmann/cel-js'
    );
    const data: NpmRegistryResponse = await response.json();

    const versions = Object.keys(data.versions).sort((a, b) =>
      a === b ? 0 : a > b ? -1 : 1
    );

    setAvailableVersions(versions);
    setLatestVersion(data['dist-tags'].latest);

    return { versions, latestVersion: data['dist-tags'].latest };
  }, []);

  /** Load a specific version dynamically via esm.sh */
  const loadVersion = useCallback(async (version: string) => {
    setIsVersionLoading(true);

    try {
      const celModule = await import(
        /* webpackIgnore: true */
        `https://esm.sh/@marcbachmann/cel-js@${version}`
      );

      setCel(celModule);
      console.log(`Loaded @marcbachmann/cel-js@${version}`);
    } catch (error) {
      console.error(`Failed to load @marcbachmann/cel-js@${version}:`, error);
      throw error;
    } finally {
      setIsVersionLoading(false);
    }
  }, []);

  return {
    cel,
    isVersionLoading,
    availableVersions,
    latestVersion,
    loadVersions,
    loadVersion,
  };
}
