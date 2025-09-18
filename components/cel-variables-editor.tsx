'use client';

import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import * as yaml from 'js-yaml';
import { VariableEditor } from './editor/variable';

interface CelVariablesEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function CelVariablesEditor({
  value,
  onChange,
}: CelVariablesEditorProps) {
  const [isValidFormat, setIsValidFormat] = useState(true);
  const [formatError, setFormatError] = useState<string>('');
  const [detectedFormat, setDetectedFormat] = useState<
    'json' | 'yaml' | 'unknown'
  >('unknown');
  const [editorLanguage, setEditorLanguage] = useState<string>('json');

  const detectFormat = (text: string): 'json' | 'yaml' | 'unknown' => {
    const trimmed = text.trim();
    if (!trimmed) return 'unknown';

    // Check if it starts with { or [ (JSON)
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      return 'json';
    }

    // Check for YAML indicators
    if (
      trimmed.includes(':') &&
      (trimmed.includes('\n') || trimmed.includes('  '))
    ) {
      return 'yaml';
    }

    return 'unknown';
  };

  const parseInput = (text: string) => {
    const format = detectFormat(text);
    setDetectedFormat(format);
    setEditorLanguage(format === 'yaml' ? 'yaml' : 'json');

    if (!text.trim()) {
      setIsValidFormat(true);
      setFormatError('');
      return;
    }

    try {
      if (format === 'json') {
        JSON.parse(text);
      } else if (format === 'yaml') {
        yaml.load(text);
      } else {
        // Try both formats
        try {
          JSON.parse(text);
          setDetectedFormat('json');
          setEditorLanguage('json');
        } catch {
          try {
            yaml.load(text);
            setDetectedFormat('yaml');
            setEditorLanguage('yaml');
          } catch {
            throw new Error('Invalid format');
          }
        }
      }
      setIsValidFormat(true);
      setFormatError('');
    } catch (error) {
      setIsValidFormat(false);
      setFormatError(error instanceof Error ? error.message : 'Invalid format');
    }
  };

  useEffect(() => {
    parseInput(value);
  }, [value]);

  const convertToJson = () => {
    if (detectedFormat === 'yaml') {
      try {
        const parsed = yaml.load(value);
        onChange(JSON.stringify(parsed, null, 2));
      } catch (error) {
        setFormatError('Failed to convert YAML to JSON');
      }
    }
  };

  const convertToYaml = () => {
    if (detectedFormat === 'json') {
      try {
        const parsed = JSON.parse(value);
        onChange(yaml.dump(parsed, { indent: 2 }));
      } catch (error) {
        setFormatError('Failed to convert JSON to YAML');
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label htmlFor="cel-variables">Variables</Label>
          {detectedFormat !== 'unknown' && (
            <Badge variant="outline" className="text-xs">
              {detectedFormat.toUpperCase()}
            </Badge>
          )}
          {!isValidFormat && (
            <Badge variant="destructive" className="text-xs">
              Invalid{' '}
              {detectedFormat !== 'unknown'
                ? detectedFormat.toUpperCase()
                : 'Format'}
            </Badge>
          )}
          {isValidFormat && value.trim() && (
            <Badge variant="secondary" className="text-xs">
              Valid{' '}
              {detectedFormat !== 'unknown'
                ? detectedFormat.toUpperCase()
                : 'Format'}
            </Badge>
          )}
        </div>

        {value.trim() && detectedFormat !== 'unknown' && (
          <div className="flex gap-1">
            {detectedFormat === 'yaml' && (
              <Button
                variant="outline"
                size="sm"
                onClick={convertToJson}
                className="text-xs h-6 px-2"
              >
                To JSON
              </Button>
            )}
            {detectedFormat === 'json' && (
              <Button
                variant="outline"
                size="sm"
                onClick={convertToYaml}
                className="text-xs h-6 px-2"
              >
                To YAML
              </Button>
            )}
          </div>
        )}
      </div>

      <Card className="p-0 overflow-hidden">
        <VariableEditor
          value={value}
          onChange={onChange}
          language={editorLanguage as 'json' | 'yaml'}
        />
      </Card>

      {!isValidFormat && formatError && (
        <div className="text-xs text-destructive">
          {detectedFormat !== 'unknown'
            ? detectedFormat.toUpperCase()
            : 'Format'}{' '}
          Error: {formatError}
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        Define variables that can be used in your CEL expression. Supports both
        JSON and YAML formats.
      </div>
    </div>
  );
}
