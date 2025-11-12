import type { Metadata } from 'next';
import {
  Geist,
  Geist_Mono,
  Source_Code_Pro,
  Fira_Code,
} from 'next/font/google';
import './globals.css';
//'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const code = Fira_Code({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-code',
});

export const metadata: Metadata = {
  title: 'CEL-JS Playground | Common Expression Language (CEL) for JavaScript',
  description:
    'Interactive playground for Common Expression Language (CEL) with JavaScript support. Write, test, and share CEL expressions with JSON/YAML variables. Perfect for Kubernetes, Istio, and policy validation.',
  keywords: [
    'CEL',
    'Common Expression Language',
    'CEL playground',
    'CEL JavaScript',
    'CEL-JS',
    'Kubernetes CEL',
    'Istio CEL',
    'policy validation',
    'expression language',
    'JSON YAML',
    'CEL examples',
    'CEL templates',
  ],
  authors: [{ name: 'Shubham' }],
  creator: 'Shubham',
  publisher: 'Shubham',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://playceljs.sksop.in/'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'CEL-JS Playground',
    description:
      'Interactive playground for Common Expression Language (CEL) with JavaScript support. Write, test, and share CEL expressions with JSON/YAML variables.',
    url: 'https://playceljs.sksop.in/',
    siteName: 'CEL-JS Playground',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CEL-JS Playground',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable}  ${code.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
