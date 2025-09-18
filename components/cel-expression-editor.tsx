'use client';

import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { CelTemplateSelector } from './cel-template-selector';
import { CelEditor } from './editor/cel';

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
      <Card className="p-0 overflow-hidden">
        <CelEditor value={value} onChange={onChange} />
      </Card>
      <div className="text-xs text-muted-foreground">
        <code className="bg-muted px-1 rounded">name == 'John'</code>,{' '}
        <code className="bg-muted px-1 rounded">size &gt;10</code>
      </div>
    </div>
  );
}
