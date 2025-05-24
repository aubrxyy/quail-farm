import dynamic from 'next/dynamic';

const EditProductClient = dynamic(() => import('./EditProductClient'), { ssr: false });

export default function EditProductWrapper({ params }: { params: { id: string } }) {
  return <EditProductClient id={params.id} />;
}