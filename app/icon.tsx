import { ImageResponse } from 'next/og';

export const size = {
  width: 64,
  height: 64,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background:
              'radial-gradient(circle at 60% 35%, #0cff9a 0%, #03241a 38%, #020608 72%, #000 100%)',
            boxShadow: '0 0 18px rgba(0,255,136,0.35) inset',
            color: '#00ff88',
            fontSize: 34,
            fontWeight: 800,
            fontFamily: 'Arial',
          }}
        >
          B
        </div>
      </div>
    ),
    size
  );
}
