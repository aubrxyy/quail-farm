import EditProductClient from './EditProductClient';

export default function EditProductWrapper({ params }: { params: { id: string } }) {
  return <EditProductClient id={params.id} />;
}