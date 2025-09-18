'use client';

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';

interface CelVariablesEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function CelVariablesEditor({
  value,
  onChange,
}: CelVariablesEditorProps) {
  const [isValidJson, setIsValidJson] = useState(true);
  const [jsonError, setJsonError] = useState<string>('');

  useEffect(() => {
    if (!value.trim()) {
      setIsValidJson(true);
      setJsonError('');
      return;
    }

    try {
      JSON.parse(value);
      setIsValidJson(true);
      setJsonError('');
    } catch (error) {
      setIsValidJson(false);
      setJsonError(error instanceof Error ? error.message : 'Invalid JSON');
    }
  }, [value]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="cel-variables">Variables (JSON)</Label>
        {!isValidJson && (
          <Badge variant="destructive" className="text-xs">
            Invalid JSON
          </Badge>
        )}
        {isValidJson && value.trim() && (
          <Badge variant="secondary" className="text-xs">
            Valid JSON
          </Badge>
        )}
      </div>

      <Card className="p-0">
        <Textarea
          id="cel-variables"
          placeholder='{"name": "John", "age": 30, "active": true}'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`min-h-[120px] resize-none border-0 focus-visible:ring-0 ${
            !isValidJson ? 'border-red-500' : ''
          }`}
          style={{
            fontFamily:
              'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          }}
        />
      </Card>

      {!isValidJson && jsonError && (
        <div className="text-xs text-destructive">JSON Error: {jsonError}</div>
      )}

      <div className="text-xs text-muted-foreground">
        Define variables that can be used in your CEL expression. Use valid JSON
        format.
      </div>
    </div>
  );
}
