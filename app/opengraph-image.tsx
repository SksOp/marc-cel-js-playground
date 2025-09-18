import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt =
  'CEL Playground - Interactive Common Expression Language Environment';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '60px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            maxWidth: '900px',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '0 0 20px 0',
              lineHeight: '1.2',
            }}
          >
            CEL Playground
          </h1>
          <p
            style={{
              fontSize: '28px',
              color: '#6b7280',
              margin: '0 0 30px 0',
              lineHeight: '1.4',
              maxWidth: '800px',
            }}
          >
            Interactive Common Expression Language Environment
          </p>
          <div
            style={{
              display: 'flex',
              gap: '20px',
              fontSize: '20px',
              color: '#4b5563',
              marginTop: '20px',
            }}
          >
            <span
              style={{
                backgroundColor: '#f3f4f6',
                padding: '8px 16px',
                borderRadius: '8px',
              }}
            >
              JavaScript
            </span>
            <span
              style={{
                backgroundColor: '#f3f4f6',
                padding: '8px 16px',
                borderRadius: '8px',
              }}
            >
              JSON/YAML
            </span>
            <span
              style={{
                backgroundColor: '#f3f4f6',
                padding: '8px 16px',
                borderRadius: '8px',
              }}
            >
              Kubernetes
            </span>
            <span
              style={{
                backgroundColor: '#f3f4f6',
                padding: '8px 16px',
                borderRadius: '8px',
              }}
            >
              Istio
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
