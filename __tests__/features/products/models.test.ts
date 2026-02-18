/**
 * Product and ProductAttribute Model Tests
 *
 * These tests verify the Product, ProductAttribute, and ProductAttributeValue
 * Prisma models work correctly.
 *
 * Tests cover:
 * - Product model: creation with required fields (name, slug, store_id)
 * - ProductStatus enum: ACTIVE, DRAFT, ARCHIVED values
 * - ProductAttribute model: with AttributeType enum (TEXT, NUMBER, COLOR, IMAGE)
 * - ProductAttributeValue model: association with ProductAttribute
 * - Unique slug constraint per store (Note: Currently slug is not unique per store in schema)
 */

import { describe, it, expect, beforeAll, afterAll } from 'bun:test';

import { prisma } from '@/lib/prisma';

// Test data identifiers
const testUserEmail = 'product-test-user@example.com';
const testSupabaseId = 'product-test-supabase-id';
const testStoreSubdomain = 'product-test-store';
let testUserId: string;
let testStoreId: string;
let testProductId: string;
let testAttributeId: string;

// Clean up test data before and after all tests
beforeAll(async () => {
  // Clean up any existing test data in reverse order of dependencies
  await prisma.productAttributeValue.deleteMany({
    where: {
      attribute: {
        product: {
          store: {
            subdomain: testStoreSubdomain,
          },
        },
      },
    },
  });

  await prisma.productAttribute.deleteMany({
    where: {
      product: {
        store: {
          subdomain: testStoreSubdomain,
        },
      },
    },
  });

  await prisma.product.deleteMany({
    where: {
      store: {
        subdomain: testStoreSubdomain,
      },
    },
  });

  await prisma.store.deleteMany({
    where: {
      subdomain: testStoreSubdomain,
    },
  });

  await prisma.user.deleteMany({
    where: {
      email: testUserEmail,
    },
  });

  // Create a test user for relationship testing
  const user = await prisma.user.create({
    data: {
      email: testUserEmail,
      username: 'producttestuser',
      supabaseId: testSupabaseId,
    },
  });
  testUserId = user.id;

  // Create a test store for product testing
  const store = await prisma.store.create({
    data: {
      name: 'Product Test Store',
      subdomain: testStoreSubdomain,
      ownerId: testUserId,
    },
  });
  testStoreId = store.id;
});

afterAll(async () => {
  // Clean up test data in correct order (child to parent)
  await prisma.productAttributeValue.deleteMany({
    where: {
      attribute: {
        product: {
          storeId: testStoreId,
        },
      },
    },
  });

  await prisma.productAttribute.deleteMany({
    where: {
      product: {
        storeId: testStoreId,
      },
    },
  });

  await prisma.product.deleteMany({
    where: {
      storeId: testStoreId,
    },
  });

  await prisma.store.deleteMany({
    where: {
      id: testStoreId,
    },
  });

  await prisma.user.deleteMany({
    where: {
      id: testUserId,
    },
  });
});

describe('Product Model', () => {
  it('should create product with required fields (name, slug, store_id)', async () => {
    const product = await prisma.product.create({
      data: {
        name: 'Test Product',
        slug: 'test-product',
        storeId: testStoreId,
      },
    });

    testProductId = product.id;

    expect(product).toBeDefined();
    expect(product.name).toBe('Test Product');
    expect(product.slug).toBe('test-product');
    expect(product.storeId).toBe(testStoreId);
    expect(product.status).toBe('DRAFT'); // Default status
    expect(product.isDigital).toBe(false); // Default value
    expect(product.isFeatured).toBe(false);
    expect(product.isNew).toBe(false);
    expect(product.isOnSale).toBe(false);
    expect(product.allowPromotions).toBe(true);
    expect(product.trackInventory).toBe(true);
    expect(product.createdAt).toBeInstanceOf(Date);
    expect(product.updatedAt).toBeInstanceOf(Date);
  });

  it('should validate ProductStatus enum values: ACTIVE, DRAFT, ARCHIVED', async () => {
    // Product starts with DRAFT (default)
    let product = await prisma.product.findUnique({
      where: { id: testProductId },
    });
    expect(product?.status).toBe('DRAFT');

    // Test ACTIVE status
    await prisma.product.update({
      where: { id: testProductId },
      data: { status: 'ACTIVE' },
    });
    product = await prisma.product.findUnique({ where: { id: testProductId } });
    expect(product?.status).toBe('ACTIVE');

    // Test ARCHIVED status
    await prisma.product.update({
      where: { id: testProductId },
      data: { status: 'ARCHIVED' },
    });
    product = await prisma.product.findUnique({ where: { id: testProductId } });
    expect(product?.status).toBe('ARCHIVED');

    // Restore to DRAFT for other tests
    await prisma.product.update({
      where: { id: testProductId },
      data: { status: 'DRAFT' },
    });
  });

  it('should establish store relationship and include SEO fields', async () => {
    // Create product with SEO fields
    const productWithSeo = await prisma.product.create({
      data: {
        name: 'SEO Test Product',
        slug: 'seo-test-product',
        storeId: testStoreId,
        description: 'A product for SEO testing',
        brand: 'Test Brand',
        seoTitle: 'Buy SEO Test Product | Best Deals',
        seoDescription: 'Get the best SEO Test Product at amazing prices.',
        urlSlug: 'seo-test-product-custom',
        ogImageUrl: 'https://example.com/og-image.jpg',
      },
      include: {
        store: true,
      },
    });

    expect(productWithSeo.store).toBeDefined();
    expect(productWithSeo.store.id).toBe(testStoreId);
    expect(productWithSeo.seoTitle).toBe('Buy SEO Test Product | Best Deals');
    expect(productWithSeo.seoDescription).toBe('Get the best SEO Test Product at amazing prices.');
    expect(productWithSeo.urlSlug).toBe('seo-test-product-custom');
    expect(productWithSeo.ogImageUrl).toBe('https://example.com/og-image.jpg');

    // Clean up
    await prisma.product.delete({ where: { id: productWithSeo.id } });
  });
});

describe('ProductAttribute Model', () => {
  it('should create ProductAttribute with AttributeType enum (TEXT, NUMBER, COLOR, IMAGE)', async () => {
    // Test TEXT attribute type
    const textAttribute = await prisma.productAttribute.create({
      data: {
        name: 'Size',
        type: 'TEXT',
        productId: testProductId,
      },
    });
    testAttributeId = textAttribute.id;

    expect(textAttribute).toBeDefined();
    expect(textAttribute.name).toBe('Size');
    expect(textAttribute.type).toBe('TEXT');
    expect(textAttribute.productId).toBe(testProductId);
    expect(textAttribute.createdAt).toBeInstanceOf(Date);
    expect(textAttribute.updatedAt).toBeInstanceOf(Date);

    // Test NUMBER attribute type
    const numberAttribute = await prisma.productAttribute.create({
      data: {
        name: 'Weight',
        type: 'NUMBER',
        productId: testProductId,
      },
    });
    expect(numberAttribute.type).toBe('NUMBER');

    // Test COLOR attribute type
    const colorAttribute = await prisma.productAttribute.create({
      data: {
        name: 'Color',
        type: 'COLOR',
        productId: testProductId,
      },
    });
    expect(colorAttribute.type).toBe('COLOR');

    // Test IMAGE attribute type
    const imageAttribute = await prisma.productAttribute.create({
      data: {
        name: 'Pattern',
        type: 'IMAGE',
        productId: testProductId,
      },
    });
    expect(imageAttribute.type).toBe('IMAGE');

    // Clean up (except textAttribute which is used in next test)
    await prisma.productAttribute.deleteMany({
      where: {
        id: { in: [numberAttribute.id, colorAttribute.id, imageAttribute.id] },
      },
    });
  });
});

describe('ProductAttributeValue Model', () => {
  it('should create ProductAttributeValue with association to ProductAttribute', async () => {
    // Create attribute values for the Size attribute
    const smallValue = await prisma.productAttributeValue.create({
      data: {
        value: 'Small',
        attributeId: testAttributeId,
      },
    });

    const mediumValue = await prisma.productAttributeValue.create({
      data: {
        value: 'Medium',
        attributeId: testAttributeId,
      },
    });

    const largeValue = await prisma.productAttributeValue.create({
      data: {
        value: 'Large',
        attributeId: testAttributeId,
      },
    });

    expect(smallValue).toBeDefined();
    expect(smallValue.value).toBe('Small');
    expect(smallValue.attributeId).toBe(testAttributeId);
    expect(smallValue.createdAt).toBeInstanceOf(Date);
    expect(smallValue.updatedAt).toBeInstanceOf(Date);

    // Verify relationship by fetching attribute with its values
    const attributeWithValues = await prisma.productAttribute.findUnique({
      where: { id: testAttributeId },
      include: {
        values: true,
      },
    });

    expect(attributeWithValues?.values).toBeDefined();
    expect(attributeWithValues?.values.length).toBe(3);

    const valueStrings = attributeWithValues?.values.map((v) => v.value);
    expect(valueStrings).toContain('Small');
    expect(valueStrings).toContain('Medium');
    expect(valueStrings).toContain('Large');

    // Clean up
    await prisma.productAttributeValue.deleteMany({
      where: { id: { in: [smallValue.id, mediumValue.id, largeValue.id] } },
    });
  });
});

describe('Product-Attribute-Value Relationships', () => {
  it('should cascade delete attributes and values when product is deleted', async () => {
    // Create a temporary product with attributes and values
    const tempProduct = await prisma.product.create({
      data: {
        name: 'Cascade Test Product',
        slug: 'cascade-test-product',
        storeId: testStoreId,
      },
    });

    const tempAttribute = await prisma.productAttribute.create({
      data: {
        name: 'Temp Attribute',
        type: 'TEXT',
        productId: tempProduct.id,
      },
    });

    const tempValue = await prisma.productAttributeValue.create({
      data: {
        value: 'Temp Value',
        attributeId: tempAttribute.id,
      },
    });

    // Delete the product (should cascade delete attribute and value)
    await prisma.product.delete({
      where: { id: tempProduct.id },
    });

    // Verify the attribute was deleted via cascade
    const deletedAttribute = await prisma.productAttribute.findUnique({
      where: { id: tempAttribute.id },
    });
    expect(deletedAttribute).toBeNull();

    // Verify the value was deleted via cascade
    const deletedValue = await prisma.productAttributeValue.findUnique({
      where: { id: tempValue.id },
    });
    expect(deletedValue).toBeNull();
  });

  it('should fetch full product hierarchy with store, attributes, and values', async () => {
    // Create a product with full hierarchy
    const fullProduct = await prisma.product.create({
      data: {
        name: 'Full Hierarchy Product',
        slug: 'full-hierarchy-product',
        storeId: testStoreId,
        status: 'ACTIVE',
        attributes: {
          create: [
            {
              name: 'Material',
              type: 'TEXT',
              values: {
                create: [
                  { value: 'Cotton' },
                  { value: 'Polyester' },
                ],
              },
            },
            {
              name: 'Color',
              type: 'COLOR',
              values: {
                create: [
                  { value: '#FF0000' },
                  { value: '#00FF00' },
                  { value: '#0000FF' },
                ],
              },
            },
          ],
        },
      },
      include: {
        store: true,
        attributes: {
          include: {
            values: true,
          },
        },
      },
    });

    expect(fullProduct.store.subdomain).toBe(testStoreSubdomain);
    expect(fullProduct.attributes.length).toBe(2);

    const materialAttr = fullProduct.attributes.find((a) => a.name === 'Material');
    expect(materialAttr?.type).toBe('TEXT');
    expect(materialAttr?.values.length).toBe(2);

    const colorAttr = fullProduct.attributes.find((a) => a.name === 'Color');
    expect(colorAttr?.type).toBe('COLOR');
    expect(colorAttr?.values.length).toBe(3);

    // Clean up (cascade deletes attributes and values)
    await prisma.product.delete({ where: { id: fullProduct.id } });
  });
});
