import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateUser } from '@/lib/auth';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const variationId = formData.get('variationId') as string;
  const text = (formData.get('text') as string) || null;
  const textColor = (formData.get('textColor') as string) || null;
  const fontFamily = (formData.get('fontFamily') as string) || null;
  const file = formData.get('image') as File | null;

  let imageUrl: string | undefined;
  if (file) {
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo inválido' },
        { status: 400 }
      );
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Arquivo excede 10MB' },
        { status: 400 }
      );
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(uploadDir, filename);
    await fs.writeFile(filepath, buffer);
    imageUrl = `/uploads/${filename}`;
  }

  const user = await getOrCreateUser();

  const cart = await prisma.cart.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  });

  const item = await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      variationId,
      customization: {
        create: {
          text,
          textColor,
          fontFamily,
          imageUrl,
        },
      },
    },
    include: { customization: true },
  });

  return NextResponse.json(item);
}

export async function GET() {
  const user = await getOrCreateUser();
  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: { items: { include: { variation: true, customization: true } } },
  });
  return NextResponse.json(cart || {});
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get('itemId');
  if (!itemId) return NextResponse.json({ error: 'itemId requerido' }, { status: 400 });
  await prisma.cartItem.delete({ where: { id: itemId } });
  return NextResponse.json({ ok: true });
}
