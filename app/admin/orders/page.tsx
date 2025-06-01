import { Suspense } from 'react';
import OrdersPageClient from './OrdersPageClient';

export const dynamic = 'force-dynamic';

export default function OrdersPage() {
  return (
    <Suspense fallback={<div>Loading orders...</div>}>
      <OrdersPageClient />
    </Suspense>
  );
}