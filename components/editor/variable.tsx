'use client';
import Editor from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { registerVariableThemes } from '@/lib/cel-language';

interface VariableEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: 'json' | 'yaml';
  height?: string;
  options?: any;
}

export function VariableEditor({
  value,
  onChange,
  language,
  height = '50vh',
  options = {},
}: VariableEditorProps) {
  const { theme, resolvedTheme } = useTheme();

  const handleEditorWillMount = (monaco: typeof import('monaco-editor')) => {
    registerVariableThemes(monaco);
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
  const editorTheme =
    resolvedTheme === 'dark' ? 'variable-theme-dark' : 'variable-theme';

  console.log(
    'Variable Editor theme:',
    editorTheme,
    'resolvedTheme:',
    resolvedTheme
  );

  return (
    <Editor
      height={height}
      language={language}
      value={value}
      onChange={(val) => onChange(val || '')}
      options={defaultOptions}
      theme={editorTheme}
      beforeMount={handleEditorWillMount}
    />
  );
}
