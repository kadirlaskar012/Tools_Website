import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'File Intelligence - Understand What’s Inside Your Files';
export const size = {
  width: 1200,
  height: 600,
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
          padding: '50px',
          position: 'relative',
        }}
      >
        {/* Glow Effects */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '20%',
            width: '350px',
            height: '350px',
            background: 'rgba(99, 102, 241, 0.25)',
            borderRadius: '50%',
            filter: 'blur(80px)',
          }}
        />

        {/* Title */}
        <div
          style={{
            fontSize: '56px',
            fontWeight: 900,
            textAlign: 'center',
            lineHeight: 1.15,
            maxWidth: '900px',
            marginBottom: '20px',
            letterSpacing: '-1px',
          }}
        >
          File Intelligence
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '24px',
            color: '#94a3b8',
            textAlign: 'center',
            maxWidth: '750px',
            lineHeight: 1.4,
            marginBottom: '32px',
          }}
        >
          Understand what’s inside your files. Privacy-first, local browser file inspection toolkit.
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
