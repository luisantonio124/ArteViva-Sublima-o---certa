import Editor from './Editor';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

interface PageProps {
  params: { tipo: string };
}

export default async function PersonalizarPage({ params }: PageProps) {
  const res = await fetch(`${baseUrl}/api/products/${params.tipo}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Falha ao carregar produto');
  }
  const product = await res.json();
  return <Editor product={product} />;
}
