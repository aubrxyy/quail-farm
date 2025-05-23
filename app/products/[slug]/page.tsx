import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductClientPage from './ProductClientPage';

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug }
  });

  if (!product) {
    notFound();
  }

  return <ProductClientPage product={product} />;
}