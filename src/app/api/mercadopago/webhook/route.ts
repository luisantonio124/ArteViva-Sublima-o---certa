import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getPayment } from '@/lib/mercadopago';

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (body.type === 'payment') {
    const paymentId = body.data.id;
    const resp = await getPayment(paymentId);
    const orderId = resp.external_reference;
    const status = resp.status;
    if (orderId) {
      await prisma.order.update({ where: { id: orderId }, data: { status } });
    }
  }
  return NextResponse.json({ ok: true });
}
