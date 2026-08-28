import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 100%)',
          borderRadius: '42px',
          boxShadow: '0 10px 25px rgba(79, 70, 229, 0.35)',
          position: 'relative',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100"
          height="100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Folded Document & Intelligence Scan Lines */}
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="9" y1="13" x2="15" y2="13" />
          <line x1="9" y1="17" x2="14" y2="17" />
        </svg>

        {/* Emerald Privacy Core Node */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            right: '24px',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            border: '4px solid #ffffff',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
