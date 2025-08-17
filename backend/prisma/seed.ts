import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gym.com' },
    update: {},
    create: {
      email: 'admin@gym.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      cedula: '12345678',
      role: 'ADMIN',
      isActive: true,
      emailVerified: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create receptionist user
  const receptionistPassword = await bcrypt.hash('receptionist123', 12);
  const receptionist = await prisma.user.upsert({
    where: { email: 'receptionist@gym.com' },
    update: {},
    create: {
      email: 'receptionist@gym.com',
      password: receptionistPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      cedula: '87654321',
      role: 'RECEPTIONIST',
      isActive: true,
      emailVerified: true,
    },
  });
  console.log('✅ Receptionist user created:', receptionist.email);

  // Create trainer user
  const trainerPassword = await bcrypt.hash('trainer123', 12);
  const trainer = await prisma.user.upsert({
    where: { email: 'trainer@gym.com' },
    update: {},
    create: {
      email: 'trainer@gym.com',
      password: trainerPassword,
      firstName: 'Mike',
      lastName: 'Johnson',
      cedula: '11223344',
      role: 'TRAINER',
      isActive: true,
      emailVerified: true,
    },
  });
  console.log('✅ Trainer user created:', trainer.email);

  // Create sample client users
  const clientPassword = await bcrypt.hash('client123', 12);
  const clients = [];
  
  for (let i = 1; i <= 5; i++) {
    const client = await prisma.user.upsert({
      where: { email: `client${i}@example.com` },
      update: {},
      create: {
        email: `client${i}@example.com`,
        password: clientPassword,
        firstName: `Client`,
        lastName: `${i}`,
        cedula: `1000100${i}`,
        phone: `+1234567890${i}`,
        role: 'CLIENT',
        isActive: true,
        emailVerified: true,
      },
    });
    clients.push(client);
  }
  console.log(`✅ ${clients.length} client users created`);

  // Create membership plans
  const plans = await Promise.all([
    prisma.membershipPlan.upsert({
      where: { name: 'Monthly Basic' },
      update: {},
      create: {
        name: 'Monthly Basic',
        description: 'Basic gym access for 1 month',
        duration: 30,
        price: 29.99,
        isActive: true,
      },
    }),
    prisma.membershipPlan.upsert({
      where: { name: 'Quarterly Premium' },
      update: {},
      create: {
        name: 'Quarterly Premium',
        description: 'Premium gym access for 3 months with classes',
        duration: 90,
        price: 79.99,
        isActive: true,
      },
    }),
    prisma.membershipPlan.upsert({
      where: { name: 'Annual VIP' },
      update: {},
      create: {
        name: 'Annual VIP',
        description: 'VIP access for 1 year with all amenities',
        duration: 365,
        price: 299.99,
        isActive: true,
      },
    }),
  ]);
  console.log(`✅ ${plans.length} membership plans created`);

  // Create sample memberships for clients
  for (let i = 0; i < clients.length; i++) {
    const client = clients[i];
    const plan = plans[i % plans.length];
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + plan.duration);

    const membership = await prisma.membership.create({
      data: {
        userId: client.id,
        planId: plan.id,
        startDate,
        endDate,
        status: 'ACTIVE',
      },
    });

    // Create payment for the membership
    await prisma.payment.create({
      data: {
        userId: client.id,
        membershipId: membership.id,
        amount: plan.price,
        method: 'CARD',
        status: 'COMPLETED',
        description: `Payment for ${plan.name}`,
        transactionId: `TXN${Date.now()}${i}`,
      },
    });
  }
  console.log(`✅ ${clients.length} memberships and payments created`);

  // Create sample classes
  const classes = [];
  const classNames = ['Morning Yoga', 'HIIT Training', 'Strength Training', 'Cardio Blast', 'Pilates'];
  
  for (let i = 0; i < classNames.length; i++) {
    const startTime = new Date();
    startTime.setDate(startTime.getDate() + i);
    startTime.setHours(9 + i, 0, 0, 0);
    
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 1);

    const gymClass = await prisma.class.create({
      data: {
        name: classNames[i],
        description: `${classNames[i]} class for all fitness levels`,
        trainerId: trainer.id,
        startTime,
        endTime,
        maxCapacity: 20,
      },
    });
    classes.push(gymClass);
  }
  console.log(`✅ ${classes.length} classes created`);

  // Create sample products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Protein Powder',
        description: 'High-quality whey protein powder',
        price: 39.99,
        stock: 50,
        minStock: 10,
        category: 'Supplements',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Gym T-Shirt',
        description: 'Comfortable workout t-shirt',
        price: 19.99,
        stock: 30,
        minStock: 5,
        category: 'Apparel',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Water Bottle',
        description: 'BPA-free water bottle',
        price: 12.99,
        stock: 25,
        minStock: 5,
        category: 'Accessories',
        isActive: true,
      },
    }),
  ]);
  console.log(`✅ ${products.length} products created`);

  console.log('🎉 Database seeded successfully!');
  console.log('\n📋 Login credentials:');
  console.log('Admin: admin@gym.com / admin123');
  console.log('Receptionist: receptionist@gym.com / receptionist123');
  console.log('Trainer: trainer@gym.com / trainer123');
  console.log('Client: client1@example.com / client123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });