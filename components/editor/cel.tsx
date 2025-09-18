'use client';

import Editor from '@monaco-editor/react';
import { registerCelLanguage } from '@/lib/cel-language';
import { useTheme } from 'next-themes';
import * as monaco from 'monaco-editor';

interface CelEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
  options?: any;
}

export function CelEditor({
  value,
  onChange,
  height = '50vh',
  options = {},
}: CelEditorProps) {
  const { theme, resolvedTheme } = useTheme();

  const handleEditorWillMount = (monaco: typeof import('monaco-editor')) => {
    registerCelLanguage(monaco);
  };

  const defaultOptions = {
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 12,
    lineNumbers: 'on',
    glyphMargin: false,
    folding: false,
    lineDecorationsWidth: 20,
    lineNumbersMinChars: 3,
    renderLineHighlight: 'line',
    overviewRulerBorder: false,
    hideCursorInOverviewRuler: true,
    overviewRulerLanes: 0,
    wordWrap: 'on',
    automaticLayout: true,
    padding: { top: 16, bottom: 16, left: 16, right: 16 },
    scrollbar: {
      vertical: 'auto',
      horizontal: 'auto',
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8,
    },
    ...options,
  };

  // Determine theme based on current theme
  const editorTheme = resolvedTheme === 'dark' ? 'cel-theme-dark' : 'cel-theme';

  console.log(
    'CEL Editor theme:',
    editorTheme,
    'resolvedTheme:',
    resolvedTheme
  );

  return (
    <Editor
      height={height}
      language="cel"
      value={value}
      onChange={(val) => onChange(val || '')}
      options={defaultOptions}
      theme={editorTheme}
      beforeMount={handleEditorWillMount}
    />
  );
}
