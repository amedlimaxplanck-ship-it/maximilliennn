import type { Metadata } from 'next';
import './globals.css';
import MaintenanceWrapper from '@/components/layout/MaintenanceWrapper';

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'Maximillien Synthetix — Kurumsal Yazılım ve Yönetim Panelleri',
  description:
    'Yazılım geliştirme, CRM panelleri, SaaS dashboard ve kurumsal dijital çözümler. Maximillien Synthetix ile iş süreçlerinizi dönüştürün.',
  keywords: ['CRM geliştirme', 'SaaS panel', 'Next.js', 'yazılım geliştirme', 'Synthetix'],
  openGraph: {
    title: 'Maximillien Synthetix — Kurumsal Yazılım ve Yönetim Panelleri',
    description: 'Yazılım geliştirme, CRM panelleri, SaaS dashboard ve kurumsal dijital çözümler.',
    type: 'website',
    images: [
      {
        url: `${baseUrl}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: 'Maximillien Synthetix — Kurumsal Yazılım ve Yönetim Panelleri',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maximillien Synthetix — Kurumsal Yazılım ve Yönetim Panelleri',
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
      <body>
        <MaintenanceWrapper>
          {children}
        </MaintenanceWrapper>
      </body>
    </html>
  );
}
