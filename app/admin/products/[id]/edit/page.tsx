import EditProductClient from './EditProductClient';

// Using 'any' here to avoid the incompatible 'Promise' error with PageProps type
export default function EditProductWrapper({ params }: { params: any }) {
  return <EditProductClient id={params.id} />;
}