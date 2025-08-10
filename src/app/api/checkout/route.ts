import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateUser } from '@/lib/auth';
import { calcularFrete } from '@/lib/correios';
import { createPreference } from '@/lib/mercadopago';

export async function POST(req: NextRequest) {
  const { cep, paymentMethod } = await req.json();
  const user = await getOrCreateUser();
  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: { items: { include: { variation: true } } },
  });
  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ error: 'Carrinho vazio' }, { status: 400 });
  }
  const frete = await calcularFrete(cep);
  const items = cart.items.map((item) => ({
    title: item.variation.name || 'Produto',
    quantity: item.quantity,
    currency_id: 'BRL',
    unit_price: Number(item.variation.price),
  }));
  const total =
    cart.items.reduce(
      (sum, item) =>
        sum + Number(item.variation.price) * item.quantity,
      0
    ) + parseFloat(frete.Valor.replace(',', '.'));
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      total,
      status: 'pending',
      items: {
        create: cart.items.map((item) => ({
          variationId: item.variationId,
          quantity: item.quantity,
          price: item.variation.price!,
        })),
      },
    },
  });
  const preference = await createPreference({
    items,
    external_reference: order.id,
    payment_methods: {
      default_payment_method_id: paymentMethod,
      excluded_payment_types: [],
    },
  });
  return NextResponse.json({
    orderId: order.id,
    preferenceId: preference.id,
    initPoint: preference.init_point,
    frete,
  });
}
