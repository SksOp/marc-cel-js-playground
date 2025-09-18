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

export function CelPlayground() {
  const [expression, setExpression] = useState('1 + 2');
  const [variables, setVariables] = useState('{}');
  const [output, setOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<string>('');

  const { cel, loadVersion, isVersionLoading } = useCelService();

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
          context = JSON.parse(variables);
        } catch (err) {
          setOutput(
            `Error parsing variables: ${
              err instanceof Error ? err.message : 'Invalid JSON'
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
          context = JSON.parse(variables);
        } catch (err) {
          setOutput(
            `Error parsing variables: ${
              err instanceof Error ? err.message : 'Invalid JSON'
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

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">CEL Playground</h1>
        <p className="text-muted-foreground">
          Test Common Expression Language (CEL) expressions with JavaScript
          support
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">CEL Playground</h2>
        </div>
        <CelVersionSelector
          onVersionChange={handleVersionChange}
          isLoading={isVersionLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left side - CEL Expression */}
        <Card>
          <CardHeader>
            <CardTitle>CEL Expression</CardTitle>
            <CardDescription>Write your CEL expression here</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CelExpressionEditor value={expression} onChange={setExpression} />
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

        {/* Right side - Variables */}
        <Card>
          <CardHeader>
            <CardTitle>Variables (JSON)</CardTitle>
            <CardDescription>
              Define variables for your expression
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CelVariablesEditor value={variables} onChange={setVariables} />
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Output */}
      <Card>
        <CardHeader>
          <CardTitle>Output</CardTitle>
          <CardDescription>Result of your CEL expression</CardDescription>
        </CardHeader>
        <CardContent>
          <CelOutputDisplay output={output} />
        </CardContent>
      </Card>
    </div>
  );
}
