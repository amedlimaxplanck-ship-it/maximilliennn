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
  const isAdminOrApi = pathname.startsWith('/admin') || pathname.startsWith('/api');
  const [maintenance, setMaintenance] = useState(isAdminOrApi ? false : initialMaintenance);

  useEffect(() => {
    // Admin sayfaları ve API uç noktaları asla bakım moduna girmemeli
    if (isAdminOrApi) {
      return;
    }

    const unsubscribe = subscribeMaintenance((status) => {
      setMaintenance(status);
    });

    return () => unsubscribe();
  }, [isAdminOrApi]);


  if (maintenance) {
    return <MaintenanceScreen />;
  }

  return <>{children}</>;
}
