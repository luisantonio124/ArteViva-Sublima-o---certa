'use client';
import { useState } from 'react';

export default function CheckoutPage() {
  const [cep, setCep] = useState('');
  const [payment, setPayment] = useState('pix');
  const [result, setResult] = useState<any>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cep, paymentMethod: payment }),
    });
    const data = await res.json();
    setResult(data);
  };
  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Checkout</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4">
        <input
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          placeholder="CEP"
          className="border p-2"
        />
        <select
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
          className="border p-2"
        >
          <option value="pix">PIX</option>
          <option value="credit_card">Cartão</option>
          <option value="ticket">Boleto</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2">
          Pagar
        </button>
      </form>
      {result && (
        <div>
          <p>Frete: R$ {result.frete?.Valor}</p>
          {result.initPoint && (
            <a href={result.initPoint} className="underline">
              Ir para pagamento
            </a>
          )}
        </div>
      )}
    </div>
  );
}
