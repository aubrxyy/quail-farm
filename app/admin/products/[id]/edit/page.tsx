import EditProductClient from './EditProductClient';

type PageProps<T extends Record<string, string> = {}> = {
  params: T;
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function EditProductWrapper({ params }: PageProps<{ id: string }>) {
  return <EditProductClient id={params.id} />;
}