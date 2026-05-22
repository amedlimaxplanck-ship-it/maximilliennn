import type { Metadata } from 'next';
import './globals.css';
import MaintenanceWrapper from '@/components/layout/MaintenanceWrapper';
import { headers } from 'next/headers';
import { getMaintenanceStatus } from '@/lib/portfolioStore';

// Sayfanın statik olarak cache'lenmesini önlemek ve her istekte dinamik olarak bakım kontrolü yapmak için force-dynamic kullanıyoruz.
export const dynamic = 'force-dynamic';

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware tarafından enjekte edilen x-pathname başlığından hangi adreste olduğumuzu sunucu tarafında öğreniyoruz.
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';

  // Admin sayfaları ve API uç noktaları asla bakım moduna girmemeli
  const isAdminOrApi = pathname.startsWith('/admin') || pathname.startsWith('/api');

  let initialMaintenance = false;
  if (!isAdminOrApi) {
    initialMaintenance = await getMaintenanceStatus();
  }

  return (
    <html lang="tr">
      <body>
        <MaintenanceWrapper initialMaintenance={initialMaintenance}>
          {children}
        </MaintenanceWrapper>
      </body>
    </html>
  );
}

