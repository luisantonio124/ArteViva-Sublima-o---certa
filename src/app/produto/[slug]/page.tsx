import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ProductPageProps {
  params: { slug: string };
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export default async function ProductPage({ params }: ProductPageProps) {
  const res = await fetch(`${baseUrl}/api/products/${params.slug}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Falha ao carregar produto');
  }
  const product = await res.json();

  return (
    <div className="p-4 space-y-4">
      {product.imageUrl && (
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={400}
          height={400}
          className="rounded"
        />
      )}
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p>{product.description}</p>
      <p className="text-xl font-semibold">R${Number(product.price).toFixed(2)}</p>
      <div>
        <h2 className="font-semibold mb-1">Atributos</h2>
        <ul className="list-disc ml-5">
          {product.variations.map((v: any) => (
            <li key={v.id}>
              {v.name} - R${Number(v.price ?? product.price).toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
      <Button asChild>
        <Link href={`/personalizar/${product.slug}`}>Personalizar</Link>
      </Button>
    </div>
  );
}
