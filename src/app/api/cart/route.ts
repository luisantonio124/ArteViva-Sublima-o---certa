import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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

  // Usuário e carrinho de demonstração
  const user = await prisma.user.upsert({
    where: { email: 'demo@demo.com' },
    update: {},
    create: { email: 'demo@demo.com', password: 'demo' },
  });

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
