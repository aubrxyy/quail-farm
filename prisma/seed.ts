import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Updating orders with addressId...');

  // List of userId-addressId pairs you have
  const mappings = [
    { userId: 20, addressId: 17 },
    { userId: 27, addressId: 18 },
    { userId: 30, addressId: 19 },
    { userId: 28, addressId: 20 },
    { userId: 29, addressId: 21 },
    { userId: 24, addressId: 22 },
    { userId: 23, addressId: 23 },
    { userId: 26, addressId: 24 },
    { userId: 25, addressId: 25 },
    { userId: 22, addressId: 26 },
    { userId: 21, addressId: 27 },
  ];

  for (const { userId, addressId } of mappings) {
    const address = await prisma.address.findUnique({ where: { id: addressId } });
    if (!address) continue;

    const formatted = `${address.label ? address.label + " - " : ""}${address.address}, ${address.district}, ${address.city}, ${address.country} ${address.postalCode}`;

    await prisma.order.updateMany({
      where: { userId },
      data: {
        addressId,
        customerAddress: formatted,
      },
    });

    console.log(`✅ Updated orders for userId ${userId} with addressId ${addressId}`);
  }

  console.log('✅ All orders updated.');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });