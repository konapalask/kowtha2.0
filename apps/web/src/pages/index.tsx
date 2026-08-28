import React, { useEffect } from 'react';
import { useRouter } from '@/utils/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return null;
}