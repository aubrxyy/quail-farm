import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductClientPage from './ProductClientPage';

export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  
  const product = await prisma.product.findUnique({
    where: { slug }
  });

  if (!product) {
    notFound();
  }

  return <ProductClientPage product={product} />;
}