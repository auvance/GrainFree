import { Suspense } from 'react';
import PageProduct from '@/components/pages/PageProduct';

export default function AboutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageProduct />
    </Suspense>
  );
}