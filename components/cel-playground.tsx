'use client';

import { useState, useEffect } from 'react';
import fastJson from 'fast-json-stringify';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CelVersionSelector } from './cel-version-selector';
import { CelExpressionEditor } from './cel-expression-editor';
import { CelVariablesEditor } from './cel-variables-editor';
import { CelOutputDisplay } from './cel-output-display';
import { useCelService } from '@/hooks/use-cel-service';
import { safeStringify } from '@/package/lib/parser';
import * as yaml from 'js-yaml';
import { examples } from '@/package/template/template';
import { ShareButton } from './share-button';
import { parseUrlState } from '@/lib/url-utils';

export function CelPlayground() {
  // Parse URL state first, before any other initialization
  const urlState = parseUrlState();

  // Determine initial state based on URL or default template
  const getInitialState = () => {
    if (urlState) {
      return {
        expression: urlState.expression || '1 + 2',
        variables: urlState.variables || '{}',
        version: urlState.version || '',
      };
    }

    // Only load default template if no URL state
    const defaultTemplate = examples.find(
      (example) => example.name === 'default'
    );

    return {
      expression: defaultTemplate?.cel || '1 + 2',
      variables: defaultTemplate?.dataInput || '{}',
      version: '',
    };
  };

  const initialState = getInitialState();

  const [expression, setExpression] = useState(initialState.expression);
  const [variables, setVariables] = useState(initialState.variables);
  const [output, setOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<string>(
    initialState.version
  );

  const { cel, loadVersion, isVersionLoading } = useCelService();

  // Load version from URL if present and clean up URL
  useEffect(() => {
    if (urlState?.version && urlState.version !== selectedVersion) {
      handleVersionChange(urlState.version);
    }

    // Remove state parameter from URL after loading
    if (urlState && typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.searchParams.has('state')) {
        url.searchParams.delete('state');
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, [urlState?.version, urlState]);

  const parseVariables = (variablesText: string) => {
    if (!variablesText.trim()) {
      return {};
    }

    const trimmed = variablesText.trim();

    // Try JSON first
    try {
      return JSON.parse(trimmed);
    } catch {
      // Try YAML
      try {
        return yaml.load(trimmed) as any;
      } catch (err) {
        throw new Error(
          `Invalid format: ${
            err instanceof Error ? err.message : 'Unknown error'
          }`
        );
      }
    }
  };

  const handleRun = async () => {
    if (!cel) {
      setOutput('Error: Please select a CEL-JS version first!');
      return;
    }

    setIsLoading(true);
    try {
      // Parse variables if provided
      let context = {};
      if (variables.trim()) {
        try {
          context = parseVariables(variables);
        } catch (err) {
          setOutput(
            `Error parsing variables: ${
              err instanceof Error ? err.message : 'Invalid format'
            }`
          );
          setIsLoading(false);
          return;
        }
      }
      console.log(expression, context);
      const result = cel.evaluate(expression, context);
      console.log(result);
      console.log(safeStringify(result));
      setOutput(safeStringify(result));
    } catch (err) {
      setOutput(
        `Error: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEvaluate = async () => {
    if (!cel) {
      setOutput('Error: Please select a CEL-JS version first!');
      return;
    }
    setIsLoading(true);
    try {
      let context = {};
      if (variables.trim()) {
        try {
          context = parseVariables(variables);
        } catch (err) {
          setOutput(
            `Error parsing variables: ${
              err instanceof Error ? err.message : 'Invalid format'
            }`
          );
          setIsLoading(false);
          return;
        }
      }
      const result = cel.evaluate(expression, context);
      console.log(result);
      setOutput(safeStringify(result));
      return;
    } catch (err) {
      console.error(err);
      setOutput(
        `Error: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVersionChange = async (version: string) => {
    setSelectedVersion(version);
    await loadVersion(version);
  };

  const handleTemplateSelect = (template: {
    cel: string;
    dataInput: string;
    name: string;
  }) => {
    setExpression(template.cel);
    setVariables(template.dataInput);
  };

  return (
    <main className="space-y-6">
      <div className="flex items-center gap-4 justify-end">
        <ShareButton
          expression={expression}
          variables={variables}
          version={selectedVersion}
        />
        <CelVersionSelector
          onVersionChange={handleVersionChange}
          isLoading={isVersionLoading}
        />
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left side - CEL Expression */}
        <article>
          <Card>
            <CardHeader className="sr-only">
              <CardTitle>CEL Expression</CardTitle>
              <CardDescription>Write your CEL expression here</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CelExpressionEditor
                value={expression}
                onChange={setExpression}
                onTemplateSelect={handleTemplateSelect}
              />
              <div className="flex gap-2 justify-end">
                <Button
                  onClick={handleEvaluate}
                  disabled={!cel || isLoading}
                  variant="secondary"
                >
                  {isLoading ? 'Evaluating...' : 'Evaluate Expression'}
                </Button>
                <Button onClick={handleRun} disabled={!cel || isLoading}>
                  {isLoading ? 'Running...' : 'Run Expression'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </article>

        {/* Right side - Variables */}
        <article>
          <Card>
            <CardHeader>
              <CardTitle>Variables</CardTitle>
              <CardDescription>
                Define variables for your expression (JSON or YAML)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CelVariablesEditor value={variables} onChange={setVariables} />
            </CardContent>
          </Card>
        </article>
      </section>

      <Separator />

      {/* Output */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Output</CardTitle>
            <CardDescription>Result of your CEL expression</CardDescription>
          </CardHeader>
          <CardContent>
            <CelOutputDisplay output={output} />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
