'use client';

import { CelPlayground } from '@/components/cel-playground';

export default function Home() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'CEL Playground',
    description:
      'Interactive playground for Common Expression Language (CEL) with JavaScript support. Write, test, and share CEL expressions with JSON/YAML variables.',
    url: 'https://playceljs.sksop.in/',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    creator: {
      '@type': 'Organization',
      name: 'CEL Playground',
    },
    featureList: [
      'Interactive CEL expression evaluation',
      'JSON and YAML variable support',
      'Template library with examples',
      'URL sharing functionality',
      'Multiple CEL version support',
      'Real-time validation',
    ],
    keywords:
      'CEL, Common Expression Language, JavaScript, Kubernetes, Istio, policy validation, expression language',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="container mx-auto px-4 py-8">
        <CelPlayground />
      </div>
    </>
  );
}
