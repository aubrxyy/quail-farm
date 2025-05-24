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

  const user2 = await prisma.user.upsert({
    where: { email: 'customer2@example.com' },
    update: {},
    create: {
      name: 'Jane Daniels',
      email: 'customer2@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'USER',
      emailVerified: true,
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'customer3@example.com' },
    update: {},
    create: {
      name: 'William Brown',
      email: 'customer3@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'USER',
      emailVerified: true,
    },
  });

  const user4 = await prisma.user.upsert({
    where: { email: 'customer4@example.com' },
    update: {},
    create: {
      name: 'Harry Johnson',
      email: 'customer4@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'USER',
      emailVerified: true,
    },
  });

  const user5 = await prisma.user.upsert({
    where: { email: 'customer5@example.com' },
    update: {},
    create: {
      name: 'Mr. Big Willy',
      email: 'customer5@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'USER',
      emailVerified: true,
    },
  });

  // Create products
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
        stock: 100,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'daging-puyuh-potong' },
      update: {},
      create: {
        name: 'Daging Puyuh Potong',
        slug: 'daging-puyuh-potong',
        gambar: '/images/daging-puyuh.jpg',
        deskripsi: 'Daging puyuh segar siap masak, tekstur lembut dan rasa gurih.',
        harga: 25000,
        stock: 50,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'puyuh-hidup' },
      update: {},
      create: {
        name: 'Puyuh Hidup',
        slug: 'puyuh-hidup',
        gambar: '/images/puyuh-hidup.jpg',
        deskripsi: 'Puyuh hidup sehat untuk ternak atau konsumsi langsung.',
        harga: 12000,
        stock: 75,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'telur-puyuh-rebus' },
      update: {},
      create: {
        name: 'Telur Puyuh Rebus',
        slug: 'telur-puyuh-rebus',
        gambar: '/images/telur-rebus.jpg',
        deskripsi: 'Telur puyuh rebus siap konsumsi, praktis dan bergizi.',
        harga: 18000,
        stock: 80,
      },
    }),
  ]);

  // Create sample orders
  const orders = await Promise.all([
prisma.order.create({
    data: {
      customerName: 'John Doe',
      customerAddress: 'Jl. Mawar No. 123, Jakarta Selatan',
      orderDate: new Date('2025-05-20'),
      orderType: 'delivery',
      orderAmount: 5,
      totalPrice: 75000,
      status: 'DELIVERED',
      productId: products[0].id,
      userId: user1.id,
    },
  }),
  prisma.order.create({
    data: {
      customerName: 'John Doe',
      customerAddress: 'Jl. Mawar No. 123, Jakarta Selatan',
      orderDate: new Date('2025-05-22'),
      orderType: 'delivery',
      orderAmount: 10,
      totalPrice: 120000,
      status: 'PENDING',
      productId: products[2].id,
      userId: user1.id,
    },
  }),

  // User 2 orders (Jane Daniels, not Jane Smith)
  prisma.order.create({
    data: {
      customerName: 'Jane Daniels', // Fixed name to match user2
      customerAddress: 'Jl. Melati No. 456, Bandung',
      orderDate: new Date('2025-05-21'),
      orderType: 'pickup',
      orderAmount: 3,
      totalPrice: 75000,
      status: 'PROCESSING',
      productId: products[1].id,
      userId: user2.id,
    },
  }),
  prisma.order.create({
    data: {
      customerName: 'Jane Daniels', // Fixed name to match user2
      customerAddress: 'Jl. Melati No. 456, Bandung',
      orderDate: new Date('2025-05-23'),
      orderType: 'delivery',
      orderAmount: 4,
      totalPrice: 72000,
      status: 'SHIPPED',
      productId: products[3].id,
      userId: user2.id,
    },
  }),

  // User 3 orders (William Brown)
  prisma.order.create({
    data: {
      customerName: 'William Brown',
      customerAddress: 'Jl. Anggrek No. 789, Yogyakarta',
      orderDate: new Date('2025-05-19'),
      orderType: 'delivery',
      orderAmount: 8,
      totalPrice: 120000,
      status: 'DELIVERED',
      productId: products[0].id,
      userId: user3.id,
    },
  }),

  // User 4 orders (Harry Johnson)
  prisma.order.create({
    data: {
      customerName: 'Harry Johnson',
      customerAddress: 'Jl. Dahlia No. 321, Surabaya',
      orderDate: new Date('2025-05-18'),
      orderType: 'delivery',
      orderAmount: 12,
      totalPrice: 144000,
      status: 'SHIPPED',
      productId: products[2].id,
      userId: user4.id,
    },
  }),

  // User 5 orders (Mr. Big Willy)
  prisma.order.create({
    data: {
      customerName: 'Mr. Big Willy',
      customerAddress: 'Jl. Kemang Raya No. 555, Jakarta Selatan',
      orderDate: new Date('2025-05-17'),
      orderType: 'delivery',
      orderAmount: 20,
      totalPrice: 300000,
      status: 'DELIVERED',
      productId: products[0].id,
      userId: user5.id,
    },
  }),
    prisma.order.create({
      data: {
        customerName: 'Admin Test Order',
        customerAddress: 'Jl. Admin No. 789, Surabaya',
        orderDate: new Date(),
        orderType: 'pickup',
        orderAmount: 2,
        totalPrice: 50000,
        status: 'SHIPPED',
        productId: products[1].id,
        userId: adminUser.id,
      },
    }),
  ]);

  console.log('✅ Database seeded successfully!');
  console.log(`📊 Created:`);
  console.log(`   - ${3} users (1 admin, 2 customers)`);
  console.log(`   - ${products.length} products`);
  console.log(`   - ${orders.length} sample orders`);
  console.log(`\n🔑 Login credentials:`);
  console.log(`   Admin: admin@cimahpar.com / admin123`);
  console.log(`   User 1: customer1@example.com / password123`);
  console.log(`   User 2: customer2@example.com / password123`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });