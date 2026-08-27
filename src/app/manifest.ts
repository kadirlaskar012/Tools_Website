import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'File Intelligence',
    short_name: 'File Intel',
    description: 'Understand what’s inside your files. Privacy-first, local browser file inspection toolkit.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#6366f1',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
