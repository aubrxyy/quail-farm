import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@cimahpar.com' },
    update: {},
    create: {
      name: 'Admin Cimahpar',
      email: 'admin@cimahpar.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
      emailVerified: true,
    },
  });

  // Create regular users
  const user1 = await prisma.user.upsert({
    where: { email: 'customer1@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'customer1@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'USER',
      emailVerified: true,
    },
  });

  // Create products with stok field (not stok)
  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: 'telur-puyuh-segar' },
      update: {},
      create: {
        name: 'Telur Puyuh Segar',
        slug: 'telur-puyuh-segar',
        gambar: '/images/telur-puyuh.jpg',
        deskripsi: 'Telur puyuh segar berkualitas tinggi, kaya protein dan nutrisi.',
        harga: 15000,
        stok: 100, // ✅ Use 'stok' not 'stok'
      },
    }),
    prisma.product.upsert({
      where: { slug: 'daging-puyuh-premium' },
      update: {},
      create: {
        name: 'Daging Puyuh Premium',
        slug: 'daging-puyuh-premium',
        gambar: '/images/daging-puyuh.jpg',
        deskripsi: 'Daging puyuh premium tanpa lemak, cocok untuk diet sehat.',
        harga: 45000,
        stok: 50,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'kotoran-puyuh-organik' },
      update: {},
      create: {
        name: 'Kotoran Puyuh Organik',
        slug: 'kotoran-puyuh-organik',
        gambar: '/images/kotoran-puyuh.jpg',
        deskripsi: 'Pupuk organik dari kotoran puyuh untuk tanaman yang subur.',
        harga: 25000,
        stok: 200,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'bibit-puyuh-unggul' },
      update: {},
      create: {
        name: 'Bibit Puyuh Unggul',
        slug: 'bibit-puyuh-unggul',
        gambar: '/images/bibit-puyuh.jpg',
        deskripsi: 'Bibit puyuh unggul dengan tingkat produktivitas tinggi.',
        harga: 8000,
        stok: 150,
      },
    }),
  ]);

    // ...existing code...
  
  // Create addresses for users
  const addresses = await Promise.all([
    prisma.address.upsert({
      where: { id: 1 }, // Use a unique field if you want true upsert, or just create if empty
      update: {},
      create: {
        userId: user1.id,
        label: 'Rumah',
        address: 'Jl. Mawar No. 123, Jakarta Selatan',
        latitude: -6.2607,
        longitude: 106.7816,
        city: 'Jakarta Selatan',
        district: 'Kebayoran Baru',
        postalCode: '12160',
        country: 'Indonesia',
      },
    }),
    prisma.address.upsert({
      where: { id: 2 },
      update: {},
      create: {
        userId: adminUser.id,
        label: 'Kantor',
        address: 'Jl. Admin No. 789, Surabaya',
        latitude: -7.2575,
        longitude: 112.7521,
        city: 'Surabaya',
        district: 'Tegalsari',
        postalCode: '60261',
        country: 'Indonesia',
      },
    }),
  ]);
  
  console.log(`   - ${addresses.length} addresses`);

  console.log('✅ Database seeded successfully!');
  console.log('📊 Created:');
  console.log(`   - ${products.length} products`);
  console.log(`   - 1 admin user: ${adminUser.email}`);
  console.log(`   - 1 test user: ${user1.email}`);
  
  console.log('\n🔑 Login credentials:');
  console.log('   Admin: admin@cimahpar.com / admin123');
  console.log('   User: customer1@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });