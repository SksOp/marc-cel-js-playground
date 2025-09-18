'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CelOutputDisplayProps {
  output: string;
}

export function CelOutputDisplay({ output }: CelOutputDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy output:', error);
    }
  };

  const isError =
    output.startsWith('Error:') || output.startsWith('Error parsing');

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Result</span>
          {isError && (
            <Badge variant="destructive" className="text-xs">
              Error
            </Badge>
          )}
          {!isError && output && (
            <Badge variant="secondary" className="text-xs">
              Success
            </Badge>
          )}
        </div>
        {output && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-8"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="ml-2">{copied ? 'Copied!' : 'Copy'}</span>
          </Button>
        )}
      </div>

      <Card className="p-0">
        <pre
          className={`p-4 text-sm overflow-auto max-h-[300px] ${
            isError ? 'text-destructive' : 'text-foreground'
          }`}
          style={{
            fontFamily:
              'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {output || 'No output yet. Run an expression to see results.'}
        </pre>
      </Card>
    </div>
  );
}
