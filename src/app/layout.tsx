import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Maximillien Synthetix — Full Stack Developer & SaaS Specialist',
  description:
    'Yazılım geliştirme, CRM panelleri, SaaS dashboard ve kurumsal dijital çözümler. Maximillien Synthetix ile iş süreçlerinizi dönüştürün.',
  keywords: ['CRM geliştirme', 'SaaS panel', 'Full Stack Developer', 'Next.js', 'yazılım geliştirme', 'Synthetix'],
  openGraph: {
    title: 'Maximillien Synthetix — Full Stack Developer & SaaS Specialist',
    description: 'Yazılım geliştirme, CRM panelleri, SaaS dashboard ve kurumsal dijital çözümler.',
    type: 'website',
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
