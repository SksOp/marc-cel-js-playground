'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Code, Github, Sun, Moon } from 'lucide-react';

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-5">
      <div className="container flex h-14 max-w-screen-2xl items-center mx-auto">
        <div className="mr-4 flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 border border-primary/20">
              <Code className="h-4 w-4" />
            </div>
            <span className="hidden font-bold sm:inline-block">
              CEL JS Playground
            </span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* You can add search or other content here */}
          </div>
          <nav className="flex items-center space-x-2">
            <a
              href="https://github.com/SksOp/marc-cel-js-playground"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </a>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle theme</span>
            </button>
          </nav>
        </div>
      </div>
    </nav>
  );
}
