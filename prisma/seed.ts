import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const canecas = await prisma.category.create({
    data: { name: "Canecas" }
  });

  const camisetas = await prisma.category.create({
    data: { name: "Camisetas" }
  });

  await prisma.product.create({
    data: {
      name: "Caneca Branca",
      description: "Caneca para sublimação 325ml",
      price: 25.0,
      categoryId: canecas.id,
      variations: {
        create: [
          { name: "Sem caixa", sku: "CAN-BRANCA-01", price: 25.0, stock: 100 },
          { name: "Com caixa", sku: "CAN-BRANCA-02", price: 27.5, stock: 80 }
        ]
      }
    }
  });

  await prisma.product.create({
    data: {
      name: "Camiseta Poliéster",
      description: "Camiseta para sublimação tamanho M",
      price: 35.0,
      categoryId: camisetas.id,
      variations: {
        create: [
          { name: "M", sku: "CAM-PL-M", price: 35.0, stock: 50 },
          { name: "G", sku: "CAM-PL-G", price: 37.0, stock: 40 }
        ]
      }
    }
  });
}

main()
  .then(() => console.log("Seed completed"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
