export interface PlaygroundState {
  expression: string;
  variables: string;
  version: string;
}

export function encodePlaygroundState(state: PlaygroundState): string {
  try {
    const encoded = btoa(JSON.stringify(state));
    return encoded;
  } catch (error) {
    console.error('Failed to encode playground state:', error);
    return '';
  }
}

export function decodePlaygroundState(
  encoded: string
): Partial<PlaygroundState> | null {
  try {
    const decoded = JSON.parse(atob(encoded));
    return decoded;
  } catch (error) {
    console.error('Failed to decode playground state:', error);
    return null;
  }
}

export function generateShareableUrl(state: PlaygroundState): string {
  const encoded = encodePlaygroundState(state);
  if (!encoded) return '';

  const url = new URL(window.location.href);
  url.searchParams.set('state', encoded);
  return url.toString();
}

export function parseUrlState(): Partial<PlaygroundState> | null {
  if (typeof window === 'undefined') return null;

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const encoded = urlParams.get('state');

    if (!encoded) return null;

    const decoded = decodePlaygroundState(encoded);

    // Validate that we have at least one meaningful field
    if (
      decoded &&
      (decoded.expression || decoded.variables || decoded.version)
    ) {
      return decoded;
    }

    return null;
  } catch (error) {
    console.error('Failed to parse URL state:', error);
    return null;
  }
}
