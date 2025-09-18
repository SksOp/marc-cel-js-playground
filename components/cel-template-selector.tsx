'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { examples } from '@/package/template/template';

interface CelTemplateSelectorProps {
  onTemplateSelect: (template: {
    cel: string;
    dataInput: string;
    name: string;
  }) => void;
}

export function CelTemplateSelector({
  onTemplateSelect,
}: CelTemplateSelectorProps) {
  const categories = Array.from(
    new Set(examples.map((example) => example.category))
  );

  return (
    <div className="space-y-2">
      <Card className="p-0">
        <Select
          onValueChange={(value) => {
            const template = examples.find((example) => example.name === value);
            if (template) {
              onTemplateSelect({
                cel: template.cel,
                dataInput: template.dataInput,
                name: template.name,
              });
            }
          }}
        >
          <SelectTrigger
            id="template-selector"
            className="border-0 focus:ring-0"
          >
            <SelectValue placeholder="Select a template..." />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <div key={category}>
                <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                  {category}
                </div>
                {examples
                  .filter((example) => example.category === category)
                  .map((example) => (
                    <SelectItem key={example.name} value={example.name}>
                      <span>{example.name}</span>
                    </SelectItem>
                  ))}
              </div>
            ))}
          </SelectContent>
        </Select>
      </Card>
    </div>
  );
}
