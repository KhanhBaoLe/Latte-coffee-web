'use client';

import { useEffect, useState } from 'react';
import Loading from './components/loading';

export default function Template({ children }: { children: React.ReactNode }) {
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (isPageLoading) {
    return <Loading />;
  }

  return (
    <div>
      {children}
    </div>
  );
}
