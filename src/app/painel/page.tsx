import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";

async function approveCustomization(id: string) {
  "use server";
  await prisma.customization.update({
    where: { id },
    data: { approved: true },
  });
  revalidatePath("/painel");
}

async function setTracking(orderId: string, formData: FormData) {
  "use server";
  const code = formData.get("trackingCode") as string;
  await prisma.order.update({
    where: { id: orderId },
    data: { trackingCode: code },
  });
  revalidatePath("/painel");
}

export default async function Painel() {
  const [products, orders, customizations] = await Promise.all([
    prisma.product.findMany(),
    prisma.order.findMany(),
    prisma.customization.findMany(),
  ]);

  return (
    <main className="p-4 space-y-8">
      <section>
        <h2 className="text-xl font-bold mb-2">Produtos</h2>
        <ul className="list-disc pl-5">
          {products.map((p) => (
            <li key={p.id}>{p.name}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">Pedidos</h2>
        <ul className="space-y-2">
          {orders.map((o) => (
            <li key={o.id} className="border p-2">
              <p className="mb-2">Pedido {o.id}</p>
              <form action={setTracking.bind(null, o.id)} className="flex gap-2">
                <input
                  name="trackingCode"
                  defaultValue={o.trackingCode ?? ""}
                  placeholder="Código de rastreio"
                  className="border p-1 flex-1"
                />
                <Button type="submit">Salvar</Button>
              </form>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">Personalizações</h2>
        <ul className="space-y-2">
          {customizations.map((c) => (
            <li key={c.id} className="border p-2 flex items-center gap-2">
              <span className="flex-1">
                {c.text || c.imageUrl || c.id}
                {c.approved ? " (aprovado)" : ""}
              </span>
              {!c.approved && (
                <form action={approveCustomization.bind(null, c.id)}>
                  <Button type="submit">Aprovar</Button>
                </form>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
