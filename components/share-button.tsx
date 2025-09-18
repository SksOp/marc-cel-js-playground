'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Copy, Check } from 'lucide-react';
import { generateShareableUrl, PlaygroundState } from '@/lib/url-utils';

interface ShareButtonProps {
  expression: string;
  variables: string;
  version: string;
}

export function ShareButton({
  expression,
  variables,
  version,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const state: PlaygroundState = {
      expression,
      variables,
      version,
    };

    const shareUrl = generateShareableUrl(state);

    if (!shareUrl) {
      alert('Failed to generate shareable URL');
      return;
    }

    try {
      // Use modern Clipboard API
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Clipboard API failed:', error);
      // Fallback: show the URL for manual copying
      const userConfirmed = confirm(
        `Unable to copy to clipboard automatically.\n\nShare this URL:\n\n${shareUrl}\n\nClick OK to continue, or Cancel to dismiss.`
      );

      if (userConfirmed) {
        // Show the URL in a more user-friendly way
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.top = '50%';
        textArea.style.left = '50%';
        textArea.style.transform = 'translate(-50%, -50%)';
        textArea.style.zIndex = '9999';
        textArea.style.width = '80%';
        textArea.style.height = '100px';
        textArea.style.fontSize = '14px';
        textArea.style.padding = '10px';
        textArea.style.border = '2px solid #ccc';
        textArea.style.borderRadius = '4px';
        textArea.style.backgroundColor = 'white';
        textArea.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        textArea.readOnly = true;

        document.body.appendChild(textArea);
        textArea.select();
        textArea.focus();

        // Remove the textarea after a delay
        setTimeout(() => {
          if (document.body.contains(textArea)) {
            document.body.removeChild(textArea);
          }
        }, 5000);
      }
    }
  };

  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger asChild>
        <Button
          onClick={handleShare}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
            </>
          )}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent
        side="top"
        className="max-w-md w-full bg-foreground/5  backdrop-blur-md border border-foreground/10"
      >
        <div className="space-y-2">
          <p className="font-semibold text-xs">How sharing works:</p>
          <ul className="text-xs space-y-1">
            <li>
              • Your current <strong>expression</strong>,{' '}
              <strong>variables</strong>, and <strong>CEL version</strong> are
              encoded into the <strong>URL</strong>
            </li>
            <li>
              • Anyone with the <strong>link</strong> will see your exact{' '}
              <strong>playground state</strong>
            </li>
            <li>
              • Perfect for sharing <strong>examples</strong>,{' '}
              <strong>debugging</strong>, or <strong>collaboration</strong>
            </li>
            <li>
              • The <strong>URL updates automatically</strong> as you make
              changes
            </li>
          </ul>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
