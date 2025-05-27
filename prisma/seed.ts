import { PrismaClient } from '@prisma/client';
import { generateSlug } from '../lib/utils';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Clearing existing data...');
  
  // Clear existing data in correct order (respecting foreign key constraints)
  await prisma.cart.deleteMany({});
  console.log('✅ Cleared cart');
  
  await prisma.order.deleteMany({});
  console.log('✅ Cleared orders');
  
  await prisma.product.deleteMany({});
  console.log('✅ Cleared products');
  
  await prisma.extraCost.deleteMany({});
  console.log('✅ Cleared extra costs');
  
  await prisma.employee.deleteMany({});
  console.log('✅ Cleared employees');
  
  await prisma.address.deleteMany({});
  console.log('✅ Cleared addresses');
  
  await prisma.notification.deleteMany({});
  console.log('✅ Cleared notifications');
  
  await prisma.user.deleteMany({});
  console.log('✅ Cleared users');

  console.log('\n🌱 Seeding database...');

  // Seed Products (Exactly 4 products as requested)
  console.log('📦 Creating products...');
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Telur Puyuh',
        slug: generateSlug('Telur Puyuh'),
        deskripsi: 'Telur puyuh segar berkualitas tinggi, dipanen langsung dari peternakan. Kaya protein dan nutrisi.',
        harga: 35000, // 35rb/kg
        stok: 50,
        gambar: '/uploads/telur-puyuh.jpg'
      }
    }),
    prisma.product.create({
      data: {
        name: 'Puyuh Potong',
        slug: generateSlug('Puyuh Potong'),
        deskripsi: 'Daging puyuh segar siap olah, rendah lemak dan tinggi protein. Cocok untuk berbagai masakan.',
        harga: 35000, // 35rb/kg
        stok: 25,
        gambar: '/uploads/puyuh-potong.jpg'
      }
    }),
    prisma.product.create({
      data: {
        name: 'Bibit Puyuh',
        slug: generateSlug('Bibit Puyuh'),
        deskripsi: 'Telur tetas puyuh berkualitas tinggi dengan tingkat penetasan mencapai 85%. Cocok untuk breeding.',
        harga: 2000, // 2rb/butir
        stok: 500,
        gambar: '/uploads/bibit-puyuh.jpg'
      }
    }),
    prisma.product.create({
      data: {
        name: 'Puyuh Hidup',
        slug: generateSlug('Puyuh Hidup'),
        deskripsi: 'Puyuh hidup dewasa siap bertelur, umur 8-12 minggu. Produktivitas telur tinggi.',
        harga: 40000, // 40rb/ekor
        stok: 100,
        gambar: '/uploads/puyuh-hidup.jpg'
      }
    })
  ]);

  console.log(`✅ Created ${products.length} products`);

  // Seed Admin User
  console.log('👨‍💼 Creating admin user...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@quailfarm.com',
      password: hashedPassword,
      name: 'Admin Quail Farm',
      phone: '08111222333',
      role: 'ADMIN'
    }
  });

  console.log(`✅ Created admin user: ${adminUser.email}`);

  // Create admin address
  await prisma.address.create({
    data: {
      userId: adminUser.id,
      label: 'Farm Office',
      address: 'Jl. Raya Bogor KM 25, Cibubur, Jakarta Timur, DKI Jakarta 13720',
      latitude: -6.3655,
      longitude: 106.8997,
      city: 'Jakarta Timur',
      district: 'Cibubur',
      postalCode: '13720',
      country: 'Indonesia'
    }
  });

  // Seed Regular Users (Jabodetabek only)
  console.log('👥 Creating regular users...');
  
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'ahmad.jakarta@email.com',
        password: hashedPassword,
        name: 'Ahmad Suryanto',
        phone: '08123456789',
        role: 'USER'
      }
    }),
    prisma.user.create({
      data: {
        email: 'siti.bogor@gmail.com',
        password: hashedPassword,
        name: 'Siti Nurhaliza',
        phone: '08198765432',
        role: 'USER'
      }
    }),
    prisma.user.create({
      data: {
        email: 'budi.bekasi@yahoo.com',
        password: hashedPassword,
        name: 'Budi Prasetyo',
        phone: '08567891234',
        role: 'USER'
      }
    }),
    prisma.user.create({
      data: {
        email: 'rina.depok@hotmail.com',
        password: hashedPassword,
        name: 'Rina Kartika',
        phone: '08234567890',
        role: 'USER'
      }
    }),
    prisma.user.create({
      data: {
        email: 'joko.jakut@email.com',
        password: hashedPassword,
        name: 'Joko Widodo',
        phone: '08345678901',
        role: 'USER'
      }
    }),
    prisma.user.create({
      data: {
        email: 'maya.tangerang@gmail.com',
        password: hashedPassword,
        name: 'Maya Sari',
        phone: '08456789012',
        role: 'USER'
      }
    }),
    prisma.user.create({
      data: {
        email: 'deni.cibinong@gmail.com',
        password: hashedPassword,
        name: 'Deni Ramadan',
        phone: '08567890123',
        role: 'USER'
      }
    }),
    prisma.user.create({
      data: {
        email: 'lisa.jaksel@yahoo.com',
        password: hashedPassword,
        name: 'Lisa Permata',
        phone: '08678901234',
        role: 'USER'
      }
    }),
    prisma.user.create({
      data: {
        email: 'rizky.serpong@gmail.com',
        password: hashedPassword,
        name: 'Rizky Pratama',
        phone: '08789012345',
        role: 'USER'
      }
    }),
    prisma.user.create({
      data: {
        email: 'ani.ciganjur@hotmail.com',
        password: hashedPassword,
        name: 'Ani Susilowati',
        phone: '08890123456',
        role: 'USER'
      }
    })
  ]);

  console.log(`✅ Created ${users.length} regular users`);

  // Create addresses for users
  console.log('📍 Creating user addresses...');
  const addresses = [
    {
      userId: users[0].id,
      label: 'Home',
      address: 'Jl. Sudirman No. 123, Menteng, Jakarta Pusat, DKI Jakarta 10310',
      latitude: -6.1944,
      longitude: 106.8229,
      city: 'Jakarta Pusat',
      district: 'Menteng',
      postalCode: '10310',
      country: 'Indonesia'
    },
    {
      userId: users[1].id,
      label: 'Home',
      address: 'Jl. Pajajaran No. 45, Bogor Tengah, Kota Bogor, Jawa Barat 16121',
      latitude: -6.5971,
      longitude: 106.8060,
      city: 'Bogor',
      district: 'Bogor Tengah',
      postalCode: '16121',
      country: 'Indonesia'
    },
    {
      userId: users[2].id,
      label: 'Home',
      address: 'Jl. Ahmad Yani No. 78, Bekasi Timur, Bekasi, Jawa Barat 17113',
      latitude: -6.2349,
      longitude: 107.0094,
      city: 'Bekasi',
      district: 'Bekasi Timur',
      postalCode: '17113',
      country: 'Indonesia'
    },
    {
      userId: users[3].id,
      label: 'Home',
      address: 'Jl. Margonda Raya No. 234, Kemiri Muka, Depok, Jawa Barat 16424',
      latitude: -6.3622,
      longitude: 106.8306,
      city: 'Depok',
      district: 'Kemiri Muka',
      postalCode: '16424',
      country: 'Indonesia'
    },
    {
      userId: users[4].id,
      label: 'Home',
      address: 'Jl. Kelapa Gading Boulevard No. 112, Kelapa Gading, Jakarta Utara, DKI Jakarta 14240',
      latitude: -6.1556,
      longitude: 106.9063,
      city: 'Jakarta Utara',
      district: 'Kelapa Gading',
      postalCode: '14240',
      country: 'Indonesia'
    },
    {
      userId: users[5].id,
      label: 'Home',
      address: 'Jl. Diponegoro No. 67, Karawaci, Tangerang, Banten 15115',
      latitude: -6.1805,
      longitude: 106.6320,
      city: 'Tangerang',
      district: 'Karawaci',
      postalCode: '15115',
      country: 'Indonesia'
    },
    {
      userId: users[6].id,
      label: 'Home',
      address: 'Jl. Raya Bogor KM 46, Cibinong, Bogor, Jawa Barat 16911',
      latitude: -6.4816,
      longitude: 106.8539,
      city: 'Bogor',
      district: 'Cibinong',
      postalCode: '16911',
      country: 'Indonesia'
    },
    {
      userId: users[7].id,
      label: 'Home',
      address: 'Jl. Fatmawati No. 89, Cilandak, Jakarta Selatan, DKI Jakarta 12560',
      latitude: -6.2904,
      longitude: 106.7910,
      city: 'Jakarta Selatan',
      district: 'Cilandak',
      postalCode: '12560',
      country: 'Indonesia'
    },
    {
      userId: users[8].id,
      label: 'Home',
      address: 'Jl. BSD Raya No. 155, Serpong, Tangerang Selatan, Banten 15321',
      latitude: -6.2615,
      longitude: 106.6759,
      city: 'Tangerang Selatan',
      district: 'Serpong',
      postalCode: '15321',
      country: 'Indonesia'
    },
    {
      userId: users[9].id,
      label: 'Home',
      address: 'Jl. Raya Parung No. 201, Ciganjur, Jakarta Selatan, DKI Jakarta 12630',
      latitude: -6.3454,
      longitude: 106.7854,
      city: 'Jakarta Selatan',
      district: 'Ciganjur',
      postalCode: '12630',
      country: 'Indonesia'
    }
  ];

  await Promise.all(addresses.map(addr => prisma.address.create({ data: addr })));
  console.log(`✅ Created ${addresses.length} addresses`);

  // Seed Orders - Updated to match your schema
  console.log('🛒 Creating orders...');
  
  const orders = await Promise.all([
    // Ahmad - 2 orders
    prisma.order.create({
      data: {
        userId: users[0].id,
        productId: products[0].id, // Telur Puyuh
        customerName: users[0].name,
        customerAddress: addresses[0].address,
        orderDate: new Date('2024-12-01'),
        orderType: 'Regular',
        orderAmount: 2, // 2kg
        totalPrice: 70000,
        status: 'DELIVERED'
      }
    }),
    prisma.order.create({
      data: {
        userId: users[0].id,
        productId: products[3].id, // Puyuh Hidup
        customerName: users[0].name,
        customerAddress: addresses[0].address,
        orderDate: new Date('2024-12-10'),
        orderType: 'Regular',
        orderAmount: 3, // 3 ekor
        totalPrice: 120000,
        status: 'PROCESSING'
      }
    }),

    // Siti - 1 order
    prisma.order.create({
      data: {
        userId: users[1].id,
        productId: products[3].id, // Puyuh Hidup
        customerName: users[1].name,
        customerAddress: addresses[1].address,
        orderDate: new Date('2024-12-05'),
        orderType: 'Bulk',
        orderAmount: 5, // 5 ekor
        totalPrice: 200000,
        status: 'PENDING'
      }
    }),

    // Budi - 3 orders
    prisma.order.create({
      data: {
        userId: users[2].id,
        productId: products[2].id, // Bibit Puyuh
        customerName: users[2].name,
        customerAddress: addresses[2].address,
        orderDate: new Date('2024-11-20'),
        orderType: 'Breeding',
        orderAmount: 25, // 25 butir
        totalPrice: 50000,
        status: 'DELIVERED'
      }
    }),
    prisma.order.create({
      data: {
        userId: users[2].id,
        productId: products[0].id, // Telur Puyuh
        customerName: users[2].name,
        customerAddress: addresses[2].address,
        orderDate: new Date('2024-12-01'),
        orderType: 'Regular',
        orderAmount: 1, // 1kg
        totalPrice: 35000,
        status: 'DELIVERED'
      }
    }),
    prisma.order.create({
      data: {
        userId: users[2].id,
        productId: products[3].id, // Puyuh Hidup
        customerName: users[2].name,
        customerAddress: addresses[2].address,
        orderDate: new Date('2024-12-12'),
        orderType: 'Expansion',
        orderAmount: 4, // 4 ekor
        totalPrice: 160000,
        status: 'PROCESSING'
      }
    }),

    // Continue with other users...
    prisma.order.create({
      data: {
        userId: users[3].id,
        productId: products[2].id, // Bibit Puyuh
        customerName: users[3].name,
        customerAddress: addresses[3].address,
        orderDate: new Date('2024-12-02'),
        orderType: 'Business',
        orderAmount: 50, // 50 butir
        totalPrice: 100000,
        status: 'DELIVERED'
      }
    }),

    prisma.order.create({
      data: {
        userId: users[4].id,
        productId: products[0].id, // Telur Puyuh
        customerName: users[4].name,
        customerAddress: addresses[4].address,
        orderDate: new Date('2024-12-08'),
        orderType: 'Regular',
        orderAmount: 1, // 1kg
        totalPrice: 35000,
        status: 'CANCELLED'
      }
    }),

    // Maya - 2 orders
    prisma.order.create({
      data: {
        userId: users[5].id,
        productId: products[3].id, // Puyuh Hidup
        customerName: users[5].name,
        customerAddress: addresses[5].address,
        orderDate: new Date('2024-11-25'),
        orderType: 'Regular',
        orderAmount: 2, // 2 ekor
        totalPrice: 80000,
        status: 'DELIVERED'
      }
    }),
    prisma.order.create({
      data: {
        userId: users[5].id,
        productId: products[1].id, // Puyuh Potong
        customerName: users[5].name,
        customerAddress: addresses[5].address,
        orderDate: new Date('2024-12-11'),
        orderType: 'Regular',
        orderAmount: 2, // 2kg
        totalPrice: 70000,
        status: 'PROCESSING'
      }
    }),

    // Continue with remaining users...
    prisma.order.create({
      data: {
        userId: users[6].id,
        productId: products[2].id, // Bibit Puyuh
        customerName: users[6].name,
        customerAddress: addresses[6].address,
        orderDate: new Date('2024-12-09'),
        orderType: 'Trial',
        orderAmount: 20, // 20 butir
        totalPrice: 40000,
        status: 'PENDING'
      }
    }),

    prisma.order.create({
      data: {
        userId: users[7].id,
        productId: products[1].id, // Puyuh Potong
        customerName: users[7].name,
        customerAddress: addresses[7].address,
        orderDate: new Date('2024-12-03'),
        orderType: 'Event',
        orderAmount: 2, // 2kg
        totalPrice: 70000,
        status: 'DELIVERED'
      }
    }),

    prisma.order.create({
      data: {
        userId: users[8].id,
        productId: products[3].id, // Puyuh Hidup
        customerName: users[8].name,
        customerAddress: addresses[8].address,
        orderDate: new Date('2024-12-13'),
        orderType: 'Hobby',
        orderAmount: 3, // 3 ekor
        totalPrice: 120000,
        status: 'PROCESSING'
      }
    }),

    prisma.order.create({
      data: {
        userId: users[9].id,
        productId: products[2].id, // Bibit Puyuh
        customerName: users[9].name,
        customerAddress: addresses[9].address,
        orderDate: new Date('2024-12-06'),
        orderType: 'Experiment',
        orderAmount: 15, // 15 butir
        totalPrice: 30000,
        status: 'DELIVERED'
      }
    })
  ]);

  console.log(`✅ Created ${orders.length} orders`);

  // Seed Extra Costs (using correct model name)
  console.log('💰 Creating extra costs...');
  
  const extraCosts = await Promise.all([
    prisma.extraCost.create({
      data: {
        name: 'Pakan Puyuh Bulan Ini',
        amount: 500000,
        category: 'Feed',
        date: new Date('2024-12-01')
      }
    }),
    prisma.extraCost.create({
      data: {
        name: 'Obat dan Vitamin Puyuh',
        amount: 150000,
        category: 'Medicine',
        date: new Date('2024-12-03')
      }
    }),
    prisma.extraCost.create({
      data: {
        name: 'Perbaikan Kandang Blok A',
        amount: 300000,
        category: 'Maintenance',
        date: new Date('2024-12-05')
      }
    }),
    prisma.extraCost.create({
      data: {
        name: 'Listrik dan Air Bulan Ini',
        amount: 200000,
        category: 'Utilities',
        date: new Date('2024-12-07')
      }
    }),
    prisma.extraCost.create({
      data: {
        name: 'Bensin Pengiriman',
        amount: 100000,
        category: 'Delivery',
        date: new Date('2024-12-10')
      }
    })
  ]);

  console.log(`✅ Created ${extraCosts.length} extra costs`);

  // Seed Employees
  console.log('👷 Creating employees...');
  
  const employees = await Promise.all([
    prisma.employee.create({
      data: {
        employeeId: 'EMP001',
        name: 'Pak Suwanto',
        position: 'Farm Manager',
        salary: 4500000,
        hireDate: new Date('2023-01-15'),
        status: 'Active',
        email: 'suwanto@quailfarm.com',
        phone: '08123000001'
      }
    }),
    prisma.employee.create({
      data: {
        employeeId: 'EMP002',
        name: 'Bu Sari',
        position: 'Breeding Specialist',
        salary: 3500000,
        hireDate: new Date('2023-03-01'),
        status: 'Active',
        email: 'sari@quailfarm.com',
        phone: '08123000002'
      }
    }),
    prisma.employee.create({
      data: {
        employeeId: 'EMP003',
        name: 'Agus',
        position: 'Caretaker',
        salary: 2500000,
        hireDate: new Date('2023-06-01'),
        status: 'Active',
        email: 'agus@quailfarm.com',
        phone: '08123000003'
      }
    })
  ]);

  console.log(`✅ Created ${employees.length} employees`);

  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`👨‍💼 Admin Users: 1`);
  console.log(`👥 Regular Users: ${users.length}`);
  console.log(`📍 Addresses: ${addresses.length + 1}`);
  console.log(`📦 Products: ${products.length}`);
  console.log(`🛒 Orders: ${orders.length}`);
  console.log(`💰 Extra Costs: ${extraCosts.length}`);
  console.log(`👷 Employees: ${employees.length}`);
  
  console.log('\n🔑 Login credentials:');
  console.log('🔴 ADMIN:');
  console.log('Email: admin@quailfarm.com');
  console.log('Password: password123');
  console.log('\n🔵 USER EXAMPLE:');
  console.log('Email: ahmad.jakarta@email.com');
  console.log('Password: password123');
  console.log('\n(All users have the same password: password123)');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });