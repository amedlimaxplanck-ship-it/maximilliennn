'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { subscribeMaintenance } from '@/lib/portfolioStore';
import MaintenanceScreen from './MaintenanceScreen';

export default function MaintenanceWrapper({ 
  children,
  initialMaintenance
}: { 
  children: React.ReactNode;
  initialMaintenance: boolean;
}) {
  const pathname = usePathname();
  const [maintenance, setMaintenance] = useState(initialMaintenance);

  useEffect(() => {
    // Admin sayfaları ve API uç noktaları asla bakım moduna girmemeli
    if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
      setMaintenance(false);
      return;
    }

    const unsubscribe = subscribeMaintenance((status) => {
      setMaintenance(status);
    });

    return () => unsubscribe();
  }, [pathname]);


  if (maintenance) {
    return <MaintenanceScreen />;
  }

  return <>{children}</>;
}
