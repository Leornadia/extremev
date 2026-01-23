import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data (in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('🧹 Cleaning existing data...');
    await prisma.quoteRequest.deleteMany();
    await prisma.savedDesign.deleteMany();
    await prisma.component.deleteMany();
    await prisma.product.deleteMany();
    await prisma.productTier.deleteMany();
    await prisma.user.deleteMany();
  }

  // Seed Product Tiers
  console.log('📦 Seeding product tiers...');
  const essentialTier = await prisma.productTier.create({
    data: {
      name: 'Essential',
      slug: 'essential',
      priceMin: 15000,
      priceMax: 35000,
      features: [
        'Pressure-treated pine construction',
        'Standard hardware and fasteners',
        'Basic slide and swing options',
        'Simple deck configurations',
        'DIY-friendly assembly',
      ],
      materials: [
        'Pressure-treated pine',
        'Galvanized steel hardware',
        'UV-resistant plastic',
      ],
      warrantyStructural: 5,
      warrantyHardware: 2,
      image: '/images/tiers/essential-tier.jpg',
      order: 1,
      published: true,
    },
  });

  const premiumTier = await prisma.productTier.create({
    data: {
      name: 'Premium',
      slug: 'premium',
      priceMin: 35000,
      priceMax: 75000,
      features: [
        'Cedar or treated hardwood construction',
        'Stainless steel hardware',
        'Multiple slide and swing varieties',
        'Modular deck system',
        'Climbing walls and accessories',
        'Professional installation available',
      ],
      materials: [
        'Cedar wood',
        'Stainless steel hardware',
        'Commercial-grade plastic',
      ],
      warrantyStructural: 10,
      warrantyHardware: 5,
      image: '/images/tiers/premium-tier.jpg',
      order: 2,
      published: true,
    },
  });

  const luxuryTier = await prisma.productTier.create({
    data: {
      name: 'Luxury',
      slug: 'luxury',
      priceMin: 75000,
      priceMax: 150000,
      features: [
        'Premium cedar or exotic hardwood',
        'Marine-grade stainless steel',
        'Custom design options',
        'Integrated playhouse features',
        'Rock climbing walls',
        'Multiple levels and towers',
        'Professional installation included',
        'Extended warranty coverage',
      ],
      materials: [
        'Premium cedar or exotic hardwood',
        'Marine-grade stainless steel',
        'Commercial playground-grade materials',
      ],
      warrantyStructural: 15,
      warrantyHardware: 10,
      image: '/images/tiers/luxury-tier.jpg',
      order: 3,
      published: true,
    },
  });

  console.log('✅ Created 3 product tiers');

  // Seed Sample Products
  console.log('🏗️ Seeding sample products...');

  const products = await prisma.product.createMany({
    data: [
      // Essential Tier Products
      {
        name: 'Backyard Explorer',
        slug: 'backyard-explorer',
        tierId: essentialTier.id,
        images: [
          '/images/products/backyard-explorer-1.jpg',
          '/images/products/backyard-explorer-2.jpg',
          '/images/products/backyard-explorer-3.jpg',
        ],
        thumbnail: '/images/products/backyard-explorer-thumb.jpg',
        shortDescription: 'Perfect starter playset for young adventurers',
        longDescription:
          'The Backyard Explorer is an ideal first jungle gym for families. Featuring a 4ft deck, wave slide, and two belt swings, this compact design fits most backyards while providing hours of entertainment.',
        basePrice: 22000,
        dimensions: { width: 12, depth: 10, height: 8, unit: 'ft' },
        ageRange: '3-8 years',
        capacity: 6,
        features: [
          '4ft platform deck',
          '8ft wave slide',
          'Two belt swings',
          'Ladder access',
          'Sandbox area',
        ],
        published: true,
      },
      {
        name: 'Adventure Station',
        slug: 'adventure-station',
        tierId: essentialTier.id,
        images: [
          '/images/products/adventure-station-1.jpg',
          '/images/products/adventure-station-2.jpg',
        ],
        thumbnail: '/images/products/adventure-station-thumb.jpg',
        shortDescription: 'Compact design with maximum play value',
        longDescription:
          'The Adventure Station packs exciting features into a space-efficient design. With dual decks, a tube slide, and climbing wall, this playset offers varied play experiences.',
        basePrice: 28500,
        dimensions: { width: 14, depth: 12, height: 9, unit: 'ft' },
        ageRange: '4-10 years',
        capacity: 8,
        features: [
          'Two 4ft decks',
          '10ft tube slide',
          'Climbing wall',
          'Three swings',
          'Monkey bars',
        ],
        published: true,
      },

      // Premium Tier Products
      {
        name: 'Mountain Peak',
        slug: 'mountain-peak',
        tierId: premiumTier.id,
        images: [
          '/images/products/mountain-peak-1.jpg',
          '/images/products/mountain-peak-2.jpg',
          '/images/products/mountain-peak-3.jpg',
          '/images/products/mountain-peak-4.jpg',
        ],
        thumbnail: '/images/products/mountain-peak-thumb.jpg',
        shortDescription: 'Multi-level adventure with premium features',
        longDescription:
          'The Mountain Peak offers an impressive multi-level play experience with premium cedar construction. Features include dual slides, a climbing wall, and an integrated playhouse area.',
        basePrice: 52000,
        dimensions: { width: 18, depth: 16, height: 12, unit: 'ft' },
        ageRange: '5-12 years',
        capacity: 12,
        features: [
          'Three deck levels (4ft, 5ft, 6ft)',
          'Spiral slide and wave slide',
          'Rock climbing wall',
          'Playhouse with windows',
          'Four swings',
          'Monkey bars',
          'Rope ladder',
        ],
        published: true,
      },
      {
        name: 'Castle Kingdom',
        slug: 'castle-kingdom',
        tierId: premiumTier.id,
        images: [
          '/images/products/castle-kingdom-1.jpg',
          '/images/products/castle-kingdom-2.jpg',
        ],
        thumbnail: '/images/products/castle-kingdom-thumb.jpg',
        shortDescription: 'Medieval-themed playset with tower design',
        longDescription:
          'Transform your backyard into a medieval kingdom with this castle-themed playset. Features turret-style towers, a drawbridge entrance, and royal blue accents.',
        basePrice: 64000,
        dimensions: { width: 20, depth: 18, height: 14, unit: 'ft' },
        ageRange: '5-12 years',
        capacity: 15,
        features: [
          'Castle tower design',
          'Drawbridge entrance',
          'Two turret decks',
          'Tube slide',
          'Climbing wall',
          'Swing set',
          'Sandbox moat',
        ],
        published: true,
      },

      // Luxury Tier Products
      {
        name: 'Ultimate Adventure',
        slug: 'ultimate-adventure',
        tierId: luxuryTier.id,
        images: [
          '/images/products/ultimate-adventure-1.jpg',
          '/images/products/ultimate-adventure-2.jpg',
          '/images/products/ultimate-adventure-3.jpg',
        ],
        thumbnail: '/images/products/ultimate-adventure-thumb.jpg',
        shortDescription: 'The pinnacle of backyard play structures',
        longDescription:
          'The Ultimate Adventure is our flagship playset, featuring everything a child could dream of. With multiple towers, varied play elements, and premium construction, this is the ultimate backyard destination.',
        basePrice: 95000,
        dimensions: { width: 25, depth: 22, height: 15, unit: 'ft' },
        ageRange: '5-14 years',
        capacity: 20,
        features: [
          'Four tower system',
          'Three slides (spiral, tube, wave)',
          'Rock climbing wall',
          'Rope bridge',
          'Integrated playhouse',
          'Six swings',
          'Monkey bars',
          'Trapeze bar',
          'Telescope and steering wheel',
        ],
        published: true,
      },
      {
        name: 'Treehouse Paradise',
        slug: 'treehouse-paradise',
        tierId: luxuryTier.id,
        images: ['/images/products/treehouse-paradise-1.jpg'],
        thumbnail: '/images/products/treehouse-paradise-thumb.jpg',
        shortDescription:
          'Elevated treehouse-style design with premium features',
        longDescription:
          'The Treehouse Paradise brings the magic of a treehouse to your backyard. Elevated design with premium cedar, integrated playhouse, and luxury features throughout.',
        basePrice: 125000,
        dimensions: { width: 28, depth: 24, height: 16, unit: 'ft' },
        ageRange: '6-14 years',
        capacity: 20,
        features: [
          'Elevated treehouse design',
          'Premium cedar construction',
          'Enclosed playhouse room',
          'Multiple slides',
          'Climbing wall and rope net',
          'Swing set with tire swing',
          'Observation deck',
          'Custom color options',
        ],
        published: true,
      },
    ],
  });

  console.log(`✅ Created ${products.count} products`);

  // Seed Sample Components for Configurator
  console.log('🧩 Seeding modular components...');

  const components = await prisma.component.createMany({
    data: [
      // Deck Components
      {
        name: '4ft Platform Deck',
        category: 'Decks',
        subcategory: 'Platforms',
        tierId: essentialTier.id,
        price: 3500,
        thumbnail: '/images/components/deck-4ft-thumb.jpg',
        model3D: '/models/components/deck-4ft.glb',
        dimensions: { width: 4, depth: 4, height: 4, unit: 'ft' },
        weight: 150,
        connectionPoints: [
          { id: 'deck-top', type: 'deck', position: { x: 0, y: 4, z: 0 } },
          { id: 'slide-1', type: 'slide', position: { x: 2, y: 4, z: 0 } },
          { id: 'slide-2', type: 'slide', position: { x: -2, y: 4, z: 0 } },
          { id: 'access-1', type: 'access', position: { x: 0, y: 0, z: 2 } },
        ],
        compatibilityRules: {
          allowedConnections: ['slides', 'access', 'roofs'],
        },
        metadata: {
          ageRange: '3-12',
          capacity: 4,
          materials: ['Pressure-treated pine'],
          colors: ['Natural wood'],
        },
        published: true,
      },
      {
        name: '5ft Platform Deck',
        category: 'Decks',
        subcategory: 'Platforms',
        tierId: premiumTier.id,
        price: 4800,
        thumbnail: '/images/components/deck-5ft-thumb.jpg',
        model3D: '/models/components/deck-5ft.glb',
        dimensions: { width: 4, depth: 4, height: 5, unit: 'ft' },
        weight: 180,
        connectionPoints: [
          { id: 'deck-top', type: 'deck', position: { x: 0, y: 5, z: 0 } },
          { id: 'slide-1', type: 'slide', position: { x: 2, y: 5, z: 0 } },
          { id: 'slide-2', type: 'slide', position: { x: -2, y: 5, z: 0 } },
          { id: 'access-1', type: 'access', position: { x: 0, y: 0, z: 2 } },
        ],
        compatibilityRules: {
          allowedConnections: ['slides', 'access', 'roofs', 'bridges'],
        },
        metadata: {
          ageRange: '5-12',
          capacity: 4,
          materials: ['Cedar wood'],
          colors: ['Natural cedar'],
        },
        published: true,
      },

      // Slide Components
      {
        name: '8ft Wave Slide',
        category: 'Slides',
        subcategory: 'Wave',
        tierId: essentialTier.id,
        price: 2200,
        thumbnail: '/images/components/slide-wave-8ft-thumb.jpg',
        model3D: '/models/components/slide-wave-8ft.glb',
        dimensions: { width: 2, depth: 8, height: 4, unit: 'ft' },
        weight: 45,
        connectionPoints: [
          { id: 'slide-top', type: 'deck', position: { x: 0, y: 4, z: 0 } },
        ],
        compatibilityRules: {
          requiresDeckHeight: 4,
          allowedDeckTypes: ['4ft', '5ft'],
        },
        metadata: {
          ageRange: '3-10',
          capacity: 1,
          materials: ['UV-resistant plastic'],
          colors: ['Blue', 'Green', 'Red', 'Yellow'],
        },
        published: true,
      },
      {
        name: '10ft Tube Slide',
        category: 'Slides',
        subcategory: 'Tube',
        tierId: premiumTier.id,
        price: 3800,
        thumbnail: '/images/components/slide-tube-10ft-thumb.jpg',
        model3D: '/models/components/slide-tube-10ft.glb',
        dimensions: { width: 2.5, depth: 10, height: 5, unit: 'ft' },
        weight: 65,
        connectionPoints: [
          { id: 'slide-top', type: 'deck', position: { x: 0, y: 5, z: 0 } },
        ],
        compatibilityRules: {
          requiresDeckHeight: 5,
          allowedDeckTypes: ['5ft', '6ft'],
        },
        metadata: {
          ageRange: '5-12',
          capacity: 1,
          materials: ['Commercial-grade plastic'],
          colors: ['Blue', 'Green', 'Yellow'],
        },
        published: true,
      },

      // Access Components
      {
        name: 'Standard Ladder',
        category: 'Access',
        subcategory: 'Ladders',
        tierId: essentialTier.id,
        price: 850,
        thumbnail: '/images/components/ladder-standard-thumb.jpg',
        model3D: '/models/components/ladder-standard.glb',
        dimensions: { width: 2, depth: 1, height: 4, unit: 'ft' },
        weight: 25,
        connectionPoints: [
          { id: 'ladder-top', type: 'deck', position: { x: 0, y: 4, z: 0 } },
        ],
        compatibilityRules: { allowedDeckTypes: ['4ft', '5ft'] },
        metadata: {
          ageRange: '3-12',
          capacity: 1,
          materials: ['Pressure-treated pine'],
          colors: ['Natural wood'],
        },
        published: true,
      },
      {
        name: 'Rock Climbing Wall',
        category: 'Access',
        subcategory: 'Climbing',
        tierId: premiumTier.id,
        price: 2400,
        thumbnail: '/images/components/climbing-wall-thumb.jpg',
        model3D: '/models/components/climbing-wall.glb',
        dimensions: { width: 4, depth: 1, height: 5, unit: 'ft' },
        weight: 80,
        connectionPoints: [
          { id: 'wall-top', type: 'deck', position: { x: 0, y: 5, z: 0 } },
        ],
        compatibilityRules: { allowedDeckTypes: ['5ft', '6ft'] },
        metadata: {
          ageRange: '5-12',
          capacity: 2,
          materials: ['Cedar wood', 'Climbing holds'],
          colors: ['Natural wood with colored holds'],
        },
        published: true,
      },

      // Swing Components
      {
        name: 'Belt Swing (Single)',
        category: 'Swings',
        subcategory: 'Belt',
        tierId: essentialTier.id,
        price: 650,
        thumbnail: '/images/components/swing-belt-thumb.jpg',
        model3D: '/models/components/swing-belt.glb',
        dimensions: { width: 2, depth: 2, height: 8, unit: 'ft' },
        weight: 15,
        connectionPoints: [
          {
            id: 'swing-beam',
            type: 'structural',
            position: { x: 0, y: 8, z: 0 },
          },
        ],
        compatibilityRules: { requiresSwingBeam: true },
        metadata: {
          ageRange: '3-12',
          capacity: 1,
          materials: ['Rubber seat', 'Galvanized chain'],
          colors: ['Black', 'Blue', 'Red', 'Green'],
        },
        published: true,
      },
      {
        name: 'Tire Swing',
        category: 'Swings',
        subcategory: 'Tire',
        tierId: premiumTier.id,
        price: 1200,
        thumbnail: '/images/components/swing-tire-thumb.jpg',
        model3D: '/models/components/swing-tire.glb',
        dimensions: { width: 3, depth: 3, height: 8, unit: 'ft' },
        weight: 35,
        connectionPoints: [
          {
            id: 'swing-beam',
            type: 'structural',
            position: { x: 0, y: 8, z: 0 },
          },
        ],
        compatibilityRules: { requiresSwingBeam: true, requiresMinSpacing: 6 },
        metadata: {
          ageRange: '5-12',
          capacity: 2,
          materials: ['Rubber tire', 'Stainless steel chain'],
          colors: ['Black tire'],
        },
        published: true,
      },

      // Accessories
      {
        name: 'Steering Wheel',
        category: 'Accessories',
        subcategory: 'Interactive',
        tierId: essentialTier.id,
        price: 280,
        thumbnail: '/images/components/accessory-steering-thumb.jpg',
        model3D: '/models/components/accessory-steering.glb',
        dimensions: { width: 1, depth: 0.5, height: 1, unit: 'ft' },
        weight: 5,
        connectionPoints: [
          { id: 'mount', type: 'deck', position: { x: 0, y: 0, z: 0 } },
        ],
        compatibilityRules: { mountsOnDeck: true },
        metadata: {
          ageRange: '3-8',
          capacity: 1,
          materials: ['Plastic'],
          colors: ['Blue', 'Red', 'Yellow'],
        },
        published: true,
      },
      {
        name: 'Telescope',
        category: 'Accessories',
        subcategory: 'Interactive',
        tierId: premiumTier.id,
        price: 450,
        thumbnail: '/images/components/accessory-telescope-thumb.jpg',
        model3D: '/models/components/accessory-telescope.glb',
        dimensions: { width: 0.5, depth: 1, height: 1.5, unit: 'ft' },
        weight: 8,
        connectionPoints: [
          { id: 'mount', type: 'deck', position: { x: 0, y: 0, z: 0 } },
        ],
        compatibilityRules: { mountsOnDeck: true },
        metadata: {
          ageRange: '4-12',
          capacity: 1,
          materials: ['Plastic', 'Acrylic lens'],
          colors: ['Green', 'Blue'],
        },
        published: true,
      },
    ],
  });

  console.log(`✅ Created ${components.count} components`);

  // Seed Sample Users (for development/testing)
  console.log('👤 Seeding sample users...');

  const testUser = await prisma.user.create({
    data: {
      email: 'test@extremev.co.za',
      name: 'Test User',
      phone: '+27 12 345 6789',
      passwordHash: '$2a$10$YourHashedPasswordHere', // This should be a real bcrypt hash in actual use
      emailVerified: new Date(),
    },
  });

  console.log(`✅ Created test user: ${testUser.email}`);

  // Seed Sample Saved Designs
  console.log('💾 Seeding sample saved designs...');

  const sampleDesign1 = await prisma.savedDesign.create({
    data: {
      userId: testUser.id,
      name: 'My Backyard Adventure',
      thumbnail: '/images/designs/sample-design-1-thumb.jpg',
      designData: {
        components: [
          {
            instanceId: 'deck-1',
            componentId: 'deck-4ft-001',
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            connections: [],
          },
          {
            instanceId: 'slide-1',
            componentId: 'slide-wave-001',
            position: { x: 4, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            connections: [
              {
                fromInstanceId: 'slide-1',
                toInstanceId: 'deck-1',
                connectionType: 'slide-to-deck',
                connectionPoint: 'slide-1',
              },
            ],
          },
          {
            instanceId: 'ladder-1',
            componentId: 'ladder-standard-001',
            position: { x: -2, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            connections: [
              {
                fromInstanceId: 'ladder-1',
                toInstanceId: 'deck-1',
                connectionType: 'access-to-deck',
                connectionPoint: 'access-1',
              },
            ],
          },
        ],
        metadata: {
          totalPrice: 6550,
          dimensions: { width: 12, depth: 10, height: 8, unit: 'ft' },
          estimatedWeight: 220,
          ageRange: '3-10 years',
        },
      },
    },
  });

  const sampleDesign2 = await prisma.savedDesign.create({
    data: {
      userId: testUser.id,
      name: 'Premium Playset Design',
      thumbnail: '/images/designs/sample-design-2-thumb.jpg',
      designData: {
        components: [
          {
            instanceId: 'deck-1',
            componentId: 'deck-5ft-001',
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            connections: [],
          },
          {
            instanceId: 'slide-1',
            componentId: 'slide-tube-001',
            position: { x: 5, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            connections: [
              {
                fromInstanceId: 'slide-1',
                toInstanceId: 'deck-1',
                connectionType: 'slide-to-deck',
                connectionPoint: 'slide-1',
              },
            ],
          },
          {
            instanceId: 'climbing-1',
            componentId: 'climbing-wall-001',
            position: { x: -2, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            connections: [
              {
                fromInstanceId: 'climbing-1',
                toInstanceId: 'deck-1',
                connectionType: 'access-to-deck',
                connectionPoint: 'access-1',
              },
            ],
          },
        ],
        metadata: {
          totalPrice: 11000,
          dimensions: { width: 16, depth: 12, height: 10, unit: 'ft' },
          estimatedWeight: 325,
          ageRange: '5-12 years',
        },
      },
    },
  });

  console.log(`✅ Created ${2} sample saved designs`);

  console.log('✨ Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Product Tiers: 3`);
  console.log(`   - Products: ${products.count}`);
  console.log(`   - Components: ${components.count}`);
  console.log(`   - Users: 1`);
  console.log(`   - Saved Designs: 2`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
