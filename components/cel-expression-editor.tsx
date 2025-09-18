'use client';

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface CelExpressionEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function CelExpressionEditor({
  value,
  onChange,
}: CelExpressionEditorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="cel-expression">Expression</Label>
      <Card className="p-0">
        <Textarea
          id="cel-expression"
          placeholder="Enter CEL expression... (e.g., 1 + 2, name == 'John', size > 10)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[120px] resize-none border-0 focus-visible:ring-0"
          style={{
            fontFamily:
              'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          }}
        />
      </Card>
      <div className="text-xs text-muted-foreground">
        Examples: <code className="bg-muted px-1 rounded">1 + 2</code>,{' '}
        <code className="bg-muted px-1 rounded">name == 'John'</code>,{' '}
        <code className="bg-muted px-1 rounded">size &gt;10</code>
      </div>
    </div>
  );
}
