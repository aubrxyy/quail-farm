import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Clear existing orders only (keep users and addresses)
  await prisma.order.deleteMany();

  // Fetch all addresses with their user
  const addresses = await prisma.address.findMany({ include: { user: true } });
  const products = await prisma.product.findMany();

  for (let i = 0; i < addresses.length; i++) {
    const address = addresses[i];
    const user = address.user;
    if (!user) continue;

    await prisma.order.create({
      data: {
        userId: user.id,
        productId: products[0]?.id ?? 1,
        addressId: address.id,
        customerName: user.name,
        customerAddress: address.address,
        orderDate: new Date().toISOString(),
        orderType: 'DELIVERY',
        orderAmount: 1,
        totalPrice: 20000,
        status: 'PENDING',
      },
    });
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });