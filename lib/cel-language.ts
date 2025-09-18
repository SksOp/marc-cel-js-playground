import * as monaco from 'monaco-editor';

// CEL language configuration
export const celLanguageConfig: monaco.languages.LanguageConfiguration = {
  comments: {
    lineComment: '//',
  },
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')'],
  ],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
};

// CEL token provider
export const celTokenProvider: monaco.languages.TokensProvider = {
  getInitialState: () => new CelState(),
  tokenize: (line: string, state: CelState) => {
    const tokens: monaco.languages.IToken[] = [];
    let currentIndex = 0;

    while (currentIndex < line.length) {
      const char = line[currentIndex];

      // Handle comments first - everything after // is a comment
      if (
        char === '/' &&
        currentIndex + 1 < line.length &&
        line[currentIndex + 1] === '/'
      ) {
        const start = currentIndex;
        while (currentIndex < line.length) {
          currentIndex++;
        }
        tokens.push({
          startIndex: start,
          scopes: 'comment',
        });
        break; // Everything after // is a comment
      }

      // Skip whitespace
      if (/\s/.test(char)) {
        currentIndex++;
        continue;
      }

      // String literals
      if (char === '"' || char === "'") {
        const start = currentIndex;
        currentIndex++;
        while (currentIndex < line.length && line[currentIndex] !== char) {
          if (line[currentIndex] === '\\' && currentIndex + 1 < line.length) {
            currentIndex += 2; // Skip escaped character
          } else {
            currentIndex++;
          }
        }
        if (currentIndex < line.length) currentIndex++; // Skip closing quote
        tokens.push({
          startIndex: start,
          scopes: 'string',
        });
        continue;
      }

      // Numbers (including decimals and negative numbers)
      if (
        /\d/.test(char) ||
        (char === '-' &&
          currentIndex + 1 < line.length &&
          /\d/.test(line[currentIndex + 1]))
      ) {
        const start = currentIndex;
        if (char === '-') currentIndex++; // Skip the minus sign
        while (
          currentIndex < line.length &&
          (/\d/.test(line[currentIndex]) || line[currentIndex] === '.')
        ) {
          currentIndex++;
        }
        tokens.push({
          startIndex: start,
          scopes: 'number',
        });
        continue;
      }

      // CEL keywords (more comprehensive)
      const keywords = [
        'true',
        'false',
        'null',
        'in',
        'has',
        'all',
        'exists',
        'size',
        'type',
        'int',
        'uint',
        'double',
        'string',
        'bool',
        'bytes',
        'timestamp',
        'duration',
        'list',
        'map',
        'null_type',
        'and',
        'or',
        'not',
      ];

      // Check for keywords
      let foundKeyword = false;
      for (const keyword of keywords) {
        if (
          line.substring(currentIndex, currentIndex + keyword.length) ===
          keyword
        ) {
          const nextChar = line[currentIndex + keyword.length];
          if (!nextChar || !/[a-zA-Z0-9_]/.test(nextChar)) {
            tokens.push({
              startIndex: currentIndex,
              scopes: 'keyword',
            });
            currentIndex += keyword.length;
            foundKeyword = true;
            break;
          }
        }
      }

      if (foundKeyword) continue;

      // CEL operators (more comprehensive) - excluding dot for special handling
      const operators = [
        '==',
        '!=',
        '<=',
        '>=',
        '&&',
        '||',
        '<',
        '>',
        '+',
        '-',
        '*',
        '/',
        '%',
        '?',
        ':',
        '[',
        ']',
        '(',
        ')',
        '{',
        '}',
        ',',
      ];

      // Check for operators
      let foundOperator = false;
      for (const operator of operators) {
        if (
          line.substring(currentIndex, currentIndex + operator.length) ===
          operator
        ) {
          tokens.push({
            startIndex: currentIndex,
            scopes: 'operator',
          });
          currentIndex += operator.length;
          foundOperator = true;
          break;
        }
      }

      if (foundOperator) continue;

      // Handle dot notation specially
      if (char === '.') {
        tokens.push({
          startIndex: currentIndex,
          scopes: 'operator',
        });
        currentIndex++;
        continue;
      }

      // Identifiers (variables, function names, etc.)
      if (/[a-zA-Z_]/.test(char)) {
        const start = currentIndex;
        while (
          currentIndex < line.length &&
          /[a-zA-Z0-9_]/.test(line[currentIndex])
        ) {
          currentIndex++;
        }

        // Check if this is part of dot notation
        const prevChar = start > 0 ? line[start - 1] : '';

        // If preceded by a dot, this is a property/method
        if (prevChar === '.') {
          tokens.push({
            startIndex: start,
            scopes: 'property',
          });
        } else {
          tokens.push({
            startIndex: start,
            scopes: 'identifier',
          });
        }
        continue;
      }

      // Single character
      currentIndex++;
    }

    return {
      tokens,
      endState: state,
    };
  },
};

class CelState implements monaco.languages.IState {
  clone(): monaco.languages.IState {
    return new CelState();
  }

  equals(other: monaco.languages.IState): boolean {
    return true;
  }
}

// Register CEL language and themes
export function registerCelLanguage(monaco: typeof import('monaco-editor')) {
  monaco.languages.register({ id: 'cel' });

  monaco.languages.setLanguageConfiguration('cel', celLanguageConfig);
  monaco.languages.setTokensProvider('cel', celTokenProvider);

  // Define CEL theme (light)
  monaco.editor.defineTheme('cel-theme', {
    base: 'vs',
    inherit: false,
    rules: [
      { token: 'keyword', foreground: '0000FF', fontStyle: 'bold' },
      { token: 'string', foreground: '008000' },
      { token: 'number', foreground: 'FF8000' },
      { token: 'operator', foreground: 'FF8000' },
      { token: 'identifier', foreground: '000000' },
      { token: 'property', foreground: '800080' },
      { token: 'comment', foreground: '6A9955' },
    ],
    colors: {
      'editor.background': '#ffffff', // --card: oklch(1 0 0) = white
      'editor.foreground': '#1a1a1a', // --card-foreground: oklch(0.13 0.028 261.692) = dark
      'editor.lineHighlightBackground': '#f8f9fa',
      'editor.selectionBackground': '#e3f2fd',
      'editorCursor.foreground': '#1a1a1a',
      'editorLineNumber.foreground': '#6b7280',
      'editorLineNumber.activeForeground': '#1a1a1a',
    },
  });

  // Define CEL theme (dark)
  monaco.editor.defineTheme('cel-theme-dark', {
    base: 'vs-dark',
    inherit: false,
    rules: [
      { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
      { token: 'string', foreground: 'CE9178' },
      { token: 'number', foreground: 'B5CEA8' },
      { token: 'operator', foreground: 'FFA500' },
      { token: 'identifier', foreground: 'D4D4D4' },
      { token: 'property', foreground: 'DDA0DD' },
      { token: 'comment', foreground: '6A9955' },
    ],
    colors: {
      'editor.background': '#2d3748', // --card: oklch(0.21 0.034 264.665) = dark blue-gray
      'editor.foreground': '#fafafa', // --card-foreground: oklch(0.985 0.002 247.839) = light
      'editor.lineHighlightBackground': '#374151',
      'editor.selectionBackground': '#264f78',
      'editorCursor.foreground': '#fafafa',
      'editorLineNumber.foreground': '#9ca3af',
      'editorLineNumber.activeForeground': '#fafafa',
    },
  });
}

// Register variable editor themes and YAML support
export function registerVariableThemes(monaco: typeof import('monaco-editor')) {
  // Register YAML language if not already registered
  if (!monaco.languages.getLanguages().find((lang) => lang.id === 'yaml')) {
    monaco.languages.register({ id: 'yaml' });

    // Define YAML language configuration
    monaco.languages.setLanguageConfiguration('yaml', {
      comments: {
        lineComment: '#',
      },
      brackets: [
        ['{', '}'],
        ['[', ']'],
        ['(', ')'],
      ],
      autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
      ],
      surroundingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
      ],
    });

    // Define YAML token provider
    const yamlTokenProvider: monaco.languages.TokensProvider = {
      getInitialState: () => new YamlState(),
      tokenize: (line: string, state: YamlState) => {
        const tokens: monaco.languages.IToken[] = [];
        let currentIndex = 0;

        while (currentIndex < line.length) {
          const char = line[currentIndex];

          // Skip whitespace
          if (/\s/.test(char)) {
            currentIndex++;
            continue;
          }

          // Comments
          if (char === '#') {
            const start = currentIndex;
            while (currentIndex < line.length) {
              currentIndex++;
            }
            tokens.push({
              startIndex: start,
              scopes: 'comment',
            });
            break;
          }

          // String literals
          if (char === '"' || char === "'") {
            const start = currentIndex;
            currentIndex++;
            while (currentIndex < line.length && line[currentIndex] !== char) {
              if (
                line[currentIndex] === '\\' &&
                currentIndex + 1 < line.length
              ) {
                currentIndex += 2; // Skip escaped character
              } else {
                currentIndex++;
              }
            }
            if (currentIndex < line.length) currentIndex++; // Skip closing quote
            tokens.push({
              startIndex: start,
              scopes: 'string',
            });
            continue;
          }

          // Numbers
          if (/\d/.test(char)) {
            const start = currentIndex;
            while (
              currentIndex < line.length &&
              (/\d/.test(line[currentIndex]) || line[currentIndex] === '.')
            ) {
              currentIndex++;
            }
            tokens.push({
              startIndex: start,
              scopes: 'number',
            });
            continue;
          }

          // YAML keywords
          const keywords = [
            'true',
            'false',
            'null',
            'True',
            'False',
            'Null',
            'TRUE',
            'FALSE',
            'NULL',
          ];
          let foundKeyword = false;
          for (const keyword of keywords) {
            if (
              line.substring(currentIndex, currentIndex + keyword.length) ===
              keyword
            ) {
              const nextChar = line[currentIndex + keyword.length];
              if (!nextChar || !/[a-zA-Z0-9_]/.test(nextChar)) {
                tokens.push({
                  startIndex: currentIndex,
                  scopes: 'keyword',
                });
                currentIndex += keyword.length;
                foundKeyword = true;
                break;
              }
            }
          }

          if (foundKeyword) continue;

          // YAML operators
          if (char === ':' || char === '-') {
            tokens.push({
              startIndex: currentIndex,
              scopes: 'operator',
            });
            currentIndex++;
            continue;
          }

          // Identifiers
          if (/[a-zA-Z_]/.test(char)) {
            const start = currentIndex;
            while (
              currentIndex < line.length &&
              /[a-zA-Z0-9_-]/.test(line[currentIndex])
            ) {
              currentIndex++;
            }
            tokens.push({
              startIndex: start,
              scopes: 'identifier',
            });
            continue;
          }

          // Single character
          currentIndex++;
        }

        return {
          tokens,
          endState: state,
        };
      },
    };

    class YamlState implements monaco.languages.IState {
      clone(): monaco.languages.IState {
        return new YamlState();
      }

      equals(other: monaco.languages.IState): boolean {
        return true;
      }
    }

    monaco.languages.setTokensProvider('yaml', yamlTokenProvider);
  }

  // Light theme
  monaco.editor.defineTheme('variable-theme', {
    base: 'vs',
    inherit: false,
    rules: [
      { token: 'keyword', foreground: '0000FF', fontStyle: 'bold' }, // color: #0000FF
      { token: 'string', foreground: '008000' }, // color: #008000
      { token: 'number', foreground: 'FF8000' }, // color: #FF8000
      { token: 'operator', foreground: 'FFA500', fontStyle: 'bold' }, // color: #FFA500 (orange)
      { token: 'identifier', foreground: '000000' }, // color: #000000
      { token: 'property', foreground: '800080' }, // color: #800080 (purple)
      { token: 'comment', foreground: '6A9955' }, // color: #6A9955
    ],
    colors: {
      'editor.background': '#ffffff', // --card: oklch(1 0 0) = white
      'editor.foreground': '#1a1a1a', // --card-foreground: oklch(0.13 0.028 261.692) = dark
      'editor.lineHighlightBackground': '#f8f9fa',
      'editor.selectionBackground': '#e3f2fd',
      'editorCursor.foreground': '#1a1a1a',
      'editorLineNumber.foreground': '#6b7280',
      'editorLineNumber.activeForeground': '#1a1a1a',
    },
  });

  // Dark theme
  monaco.editor.defineTheme('variable-theme-dark', {
    base: 'vs-dark',
    inherit: false,
    rules: [
      { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' }, // color: #569CD6
      { token: 'string', foreground: 'CE9178' }, // color: #CE9178
      { token: 'number', foreground: 'B5CEA8' }, // color: #B5CEA8
      { token: 'operator', foreground: 'FFA500', fontStyle: 'bold' }, // color: #FFA500 (orange)
      { token: 'identifier', foreground: 'D4D4D4' }, // color: #D4D4D4
      { token: 'property', foreground: 'DDA0DD' }, // color: #DDA0DD (light purple)
      { token: 'comment', foreground: '6A9955' }, // color: #6A9955
    ],
    colors: {
      'editor.background': '#2d3748', // --card: oklch(0.21 0.034 264.665) = dark blue-gray
      'editor.foreground': '#fafafa', // --card-foreground: oklch(0.985 0.002 247.839) = light
      'editor.lineHighlightBackground': '#374151',
      'editor.selectionBackground': '#264f78',
      'editorCursor.foreground': '#fafafa',
      'editorLineNumber.foreground': '#9ca3af',
      'editorLineNumber.activeForeground': '#fafafa',
    },
  });
}
