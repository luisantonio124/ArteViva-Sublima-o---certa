'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CarrinhoPage() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/cart')
      .then((r) => r.json())
      .then((data) => setItems(data?.items || []));
  }, []);
  if (items.length === 0) {
    return <div className="p-4">Carrinho vazio</div>;
  }
  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Carrinho</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id} className="mb-2">
            {item.variation?.name} x {item.quantity}
          </li>
        ))}
      </ul>
      <Link href="/checkout" className="underline">
        Ir para Checkout
      </Link>
    </div>
  );
}
