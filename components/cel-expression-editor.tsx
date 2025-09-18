'use client';

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { CelTemplateSelector } from './cel-template-selector';

interface CelExpressionEditorProps {
  value: string;
  onChange: (value: string) => void;
  onTemplateSelect?: (template: {
    cel: string;
    dataInput: string;
    name: string;
  }) => void;
}

export function CelExpressionEditor({
  value,
  onChange,
  onTemplateSelect,
}: CelExpressionEditorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="cel-expression">Expression</Label>
        {onTemplateSelect && (
          <CelTemplateSelector onTemplateSelect={onTemplateSelect} />
        )}
      </div>
      <Card className="p-0">
        <Textarea
          id="cel-expression"
          placeholder="Enter CEL expression... (e.g., 1 + 2, name == 'John', size > 10)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[120px] border-0 focus-visible:ring-0"
          spellCheck={false}
          style={{
            fontFamily:
              'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          }}
        />
      </Card>
      <div className="text-xs text-muted-foreground">
        <code className="bg-muted px-1 rounded">name == 'John'</code>,{' '}
        <code className="bg-muted px-1 rounded">size &gt;10</code>
      </div>
    </div>
  );
}
