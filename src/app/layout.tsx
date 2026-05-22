import type { Metadata } from 'next';
import './globals.css';

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'Maximillien Synthetix — Full Stack Developer & SaaS Specialist',
  description:
    'Yazılım geliştirme, CRM panelleri, SaaS dashboard ve kurumsal dijital çözümler. Maximillien Synthetix ile iş süreçlerinizi dönüştürün.',
  keywords: ['CRM geliştirme', 'SaaS panel', 'Full Stack Developer', 'Next.js', 'yazılım geliştirme', 'Synthetix'],
  openGraph: {
    title: 'Maximillien Synthetix — Full Stack Developer & SaaS Specialist',
    description: 'Yazılım geliştirme, CRM panelleri, SaaS dashboard ve kurumsal dijital çözümler.',
    type: 'website',
    images: [
      {
        url: `${baseUrl}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: 'Maximillien Synthetix — Full Stack Developer & SaaS Specialist',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maximillien Synthetix — Full Stack Developer & SaaS Specialist',
    description: 'Yazılım geliştirme, CRM panelleri, SaaS dashboard ve kurumsal dijital çözümler.',
    images: [`${baseUrl}/twitter-image.png`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
