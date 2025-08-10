import { cookies } from 'next/headers';
import { prisma } from './prisma';
import { randomUUID } from 'crypto';

export async function getOrCreateUser() {
  const store = cookies();
  let userId = store.get('userId')?.value;
  let user = userId
    ? await prisma.user.findUnique({ where: { id: userId } })
    : null;
  if (!user) {
    const id = randomUUID();
    user = await prisma.user.create({
      data: {
        id,
        email: `guest-${id}@example.com`,
        password: 'guest',
      },
    });
    store.set('userId', user.id, { path: '/', httpOnly: true });
  }
  return user;
}
