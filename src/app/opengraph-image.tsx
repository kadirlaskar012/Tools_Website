import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'File Intelligence - Understand What’s Inside Your Files';
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
          background: 'linear-gradient(135deg, #090d16 0%, #1e1b4b 50%, #0f172a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: 'white',
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* Glow Effects */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '20%',
            width: '400px',
            height: '400px',
            background: 'rgba(99, 102, 241, 0.25)',
            borderRadius: '50%',
            filter: 'blur(80px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '20%',
            width: '400px',
            height: '400px',
            background: 'rgba(236, 72, 153, 0.2)',
            borderRadius: '50%',
            filter: 'blur(80px)',
          }}
        />

        {/* Brand Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '10px 24px',
            borderRadius: '9999px',
            fontSize: '18px',
            fontWeight: 700,
            letterSpacing: '2px',
            color: '#a5b4fc',
            marginBottom: '32px',
          }}
        >
          <span>PRIVACY-FIRST FILE ANALYSIS</span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '64px',
            fontWeight: 900,
            textAlign: 'center',
            lineHeight: 1.15,
            maxWidth: '1000px',
            marginBottom: '24px',
            letterSpacing: '-1px',
          }}
        >
          Understand What’s Inside Your Files
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '24px',
            color: '#94a3b8',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.4,
            marginBottom: '40px',
          }}
        >
          Inspect metadata, hidden sheets, page dimensions, DPI resolution, and encodings locally in your browser.
        </div>

        {/* Features Row */}
        <div
          style={{
            display: 'flex',
            gap: '24px',
          }}
        >
          {['100% Client-Side', 'Zero Cloud Uploads', 'Instant In-Memory Analysis'].map((feature, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '8px 20px',
                borderRadius: '16px',
                fontSize: '16px',
                fontWeight: 600,
                color: '#e2e8f0',
              }}
            >
              {feature}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
