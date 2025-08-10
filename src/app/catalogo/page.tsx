import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface CatalogPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const PAGE_SIZE = 6;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const page = Number(searchParams.page) || 1;
  const search = typeof searchParams.search === 'string' ? searchParams.search : '';
  const category = typeof searchParams.category === 'string' ? searchParams.category : '';
  const minPrice = typeof searchParams.minPrice === 'string' ? searchParams.minPrice : '';
  const maxPrice = typeof searchParams.maxPrice === 'string' ? searchParams.maxPrice : '';

  const query = new URLSearchParams({
    page: page.toString(),
    pageSize: PAGE_SIZE.toString(),
  });
  if (search) query.set('search', search);
  if (category) query.set('category', category);
  if (minPrice) query.set('minPrice', minPrice);
  if (maxPrice) query.set('maxPrice', maxPrice);

  const [productsRes, categoriesRes] = await Promise.all([
    fetch(`${baseUrl}/api/products?${query.toString()}`, { cache: 'no-store' }),
    fetch(`${baseUrl}/api/categories`, { cache: 'no-store' }),
  ]);

  const { products, total } = await productsRes.json();
  const categories = await categoriesRes.json();
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="p-4 space-y-4">
      <form className="flex flex-wrap gap-2">
        <input
          name="search"
          defaultValue={search}
          placeholder="Buscar..."
          className="border p-2 rounded"
        />
        <select name="category" defaultValue={category} className="border p-2 rounded">
          <option value="">Todas as categorias</option>
          {categories.map((cat: any) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="minPrice"
          placeholder="Preço mínimo"
          defaultValue={minPrice}
          className="border p-2 rounded w-32"
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Preço máximo"
          defaultValue={maxPrice}
          className="border p-2 rounded w-32"
        />
        <Button type="submit">Filtrar</Button>
      </form>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product: any) => (
          <div key={product.id} className="border rounded p-4 flex flex-col">
            {product.imageUrl && (
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={300}
                height={300}
                className="object-cover mb-2 rounded"
              />
            )}
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-sm text-muted-foreground">
              {product.variations.map((v: any) => v.name).join(', ')}
            </p>
            <p className="text-lg font-bold mt-auto">
              R${Number(product.price).toFixed(2)}
            </p>
            <Button asChild className="mt-2">
              <Link href={`/produto/${product.slug}`}>Personalizar</Link>
            </Button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        {Array.from({ length: totalPages }, (_, i) => {
          const p = i + 1;
          const q = new URLSearchParams(query);
          q.set('page', p.toString());
          return (
            <Link
              key={p}
              href={`/catalogo?${q.toString()}`}
              className={`px-3 py-1 border rounded ${p === page ? 'bg-primary text-primary-foreground' : ''}`}
            >
              {p}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
