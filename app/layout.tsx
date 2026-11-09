import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/outfit';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://apply.digetech.org'),
  title: 'Volunteer with DIGETECH | Apply',
  description:
    'DIGETECH is opening its doors to 10 year one and two students who want real world experience on real projects like KASH. Apply to volunteer.',
  icons: { icon: '/logo.png', apple: '/logo.png' },
  openGraph: {
    title: 'Volunteer with DIGETECH | Apply',
    description: 'Gain real world experience on real projects like KASH. 10 spots for year one and two students.',
    url: 'https://apply.digetech.org',
    siteName: 'DIGETECH',
    images: ['/logo.png'],
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#10B981',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
