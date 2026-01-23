// Common database queries and utilities
import prisma from '@/lib/prisma';
import type {
  ProductTierWhereInput,
  ProductWhereInput,
  ComponentWhereInput,
} from '@/lib/types/database';

// Product Tier queries
export async function getProductTiers(where?: ProductTierWhereInput) {
  return prisma.productTier.findMany({
    where: { published: true, ...where },
    orderBy: { order: 'asc' },
  });
}

export async function getProductTierBySlug(slug: string) {
  return prisma.productTier.findUnique({
    where: { slug },
    include: {
      products: {
        where: { published: true },
        orderBy: { basePrice: 'asc' },
      },
    },
  });
}

// Product queries
export async function getProducts(where?: ProductWhereInput) {
  return prisma.product.findMany({
    where: { published: true, ...where },
    include: { tier: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { tier: true },
  });
}

export async function getProductsByTier(tierId: string) {
  return prisma.product.findMany({
    where: { tierId, published: true },
    include: { tier: true },
    orderBy: { basePrice: 'asc' },
  });
}

// Component queries
export async function getComponents(where?: ComponentWhereInput) {
  return prisma.component.findMany({
    where: { published: true, ...where },
    include: { tier: true },
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  });
}

export async function getComponentsByCategory(category: string) {
  return prisma.component.findMany({
    where: { category, published: true },
    include: { tier: true },
    orderBy: { name: 'asc' },
  });
}

export async function getComponentById(id: string) {
  return prisma.component.findUnique({
    where: { id },
    include: { tier: true },
  });
}

// User queries
export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function getUserWithDesigns(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      savedDesigns: {
        orderBy: { updatedAt: 'desc' },
      },
    },
  });
}

// SavedDesign queries
export async function getSavedDesignsByUser(userId: string) {
  return prisma.savedDesign.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });
}

export async function getSavedDesignById(id: string, userId: string) {
  return prisma.savedDesign.findFirst({
    where: { id, userId },
  });
}

// QuoteRequest queries
export async function getQuoteRequestsByUser(userId: string) {
  return prisma.quoteRequest.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getQuoteRequestById(id: string) {
  return prisma.quoteRequest.findUnique({
    where: { id },
    include: { user: true },
  });
}

export async function getPendingQuoteRequests() {
  return prisma.quoteRequest.findMany({
    where: { status: 'pending' },
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });
}

// Utility functions
export async function searchProducts(searchTerm: string) {
  return prisma.product.findMany({
    where: {
      published: true,
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { shortDescription: { contains: searchTerm, mode: 'insensitive' } },
        { longDescription: { contains: searchTerm, mode: 'insensitive' } },
      ],
    },
    include: { tier: true },
    take: 10,
  });
}

export async function getComponentCategories() {
  const components = await prisma.component.findMany({
    where: { published: true },
    select: { category: true },
    distinct: ['category'],
  });

  return components.map((component) => component.category);
}

// Statistics queries (for admin dashboard)
export async function getDatabaseStats() {
  const [productCount, componentCount, userCount, quoteCount] =
    await Promise.all([
      prisma.product.count({ where: { published: true } }),
      prisma.component.count({ where: { published: true } }),
      prisma.user.count(),
      prisma.quoteRequest.count(),
    ]);

  return {
    products: productCount,
    components: componentCount,
    users: userCount,
    quotes: quoteCount,
  };
}
