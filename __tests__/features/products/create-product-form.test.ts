/**
 * Product Creation Form Tests
 *
 * These tests verify the core logic of the product creation multi-step form:
 * - Variant generation from product options (cartesian product)
 * - Form state mapping to server action input
 * - Digital product configuration mapping
 * - Initial form values structure
 *
 * Tests cover:
 * - generateVariantCombinations produces correct cartesian product of options
 * - mapFormStateToActionInput maps form state to CreateFullProductInput correctly
 * - Form submission maps variants with proper SKU auto-generation
 * - Digital product fields are included only when isDigital is true
 * - Empty options/images result in undefined (not empty arrays) in action input
 */

import { describe, it, expect } from 'bun:test';

import { generateVariantCombinations } from '@/features/products/utils/generate-variant-combinations';
import { mapFormStateToActionInput } from '@/features/products/utils/map-form-state-to-action-input';
import { CREATE_PRODUCT_INITIAL_VALUES } from '@/features/products/constants/create-product-form';
import type { CreateProductOption, CreateProductFormState } from '@/features/products/types';

describe('generateVariantCombinations', () => {
  it('should generate correct cartesian product from two options', () => {
    const options: CreateProductOption[] = [
      {
        id: 'opt-size',
        name: 'Talla',
        type: 'TEXT',
        values: [
          { id: 'val-s', value: 'S' },
          { id: 'val-m', value: 'M' },
        ],
      },
      {
        id: 'opt-color',
        name: 'Color',
        type: 'TEXT',
        values: [
          { id: 'val-red', value: 'Rojo' },
          { id: 'val-blue', value: 'Azul' },
        ],
      },
    ];

    const variants = generateVariantCombinations(options);

    // 2 sizes x 2 colors = 4 variants
    expect(variants).toHaveLength(4);

    // Check combination labels
    const combinations = variants.map((v) => v.attributeCombination);
    expect(combinations).toContain('S / Rojo');
    expect(combinations).toContain('S / Azul');
    expect(combinations).toContain('M / Rojo');
    expect(combinations).toContain('M / Azul');

    // Each variant should have correct attribute value IDs
    const sRedVariant = variants.find((v) => v.attributeCombination === 'S / Rojo');
    expect(sRedVariant?.attributeValueIds).toEqual(['val-s', 'val-red']);

    // All variants should have default values
    for (const variant of variants) {
      expect(variant.sku).toBe('');
      expect(variant.price).toBe(0);
      expect(variant.promotionalPrice).toBeNull();
      expect(variant.cost).toBeNull();
      expect(variant.isEnabled).toBe(true);
      expect(variant.id).toBeTruthy();
    }
  });

  it('should return empty array when options have no values', () => {
    const options: CreateProductOption[] = [
      {
        id: 'opt-1',
        name: 'Talla',
        type: 'TEXT',
        values: [],
      },
    ];

    const variants = generateVariantCombinations(options);
    expect(variants).toHaveLength(0);
  });

  it('should return empty array when no options provided', () => {
    const variants = generateVariantCombinations([]);
    expect(variants).toHaveLength(0);
  });

  it('should handle single option with multiple values', () => {
    const options: CreateProductOption[] = [
      {
        id: 'opt-size',
        name: 'Talla',
        type: 'TEXT',
        values: [
          { id: 'val-s', value: 'S' },
          { id: 'val-m', value: 'M' },
          { id: 'val-l', value: 'L' },
        ],
      },
    ];

    const variants = generateVariantCombinations(options);
    expect(variants).toHaveLength(3);

    const combinations = variants.map((v) => v.attributeCombination);
    expect(combinations).toContain('S');
    expect(combinations).toContain('M');
    expect(combinations).toContain('L');
  });
});

describe('mapFormStateToActionInput', () => {
  const storeId = 'store-123';

  it('should map basic product without variants or images correctly', () => {
    const formState: CreateProductFormState = {
      ...CREATE_PRODUCT_INITIAL_VALUES,
      basicInfo: {
        name: 'Mi Producto',
        description: 'Una descripcion',
        slug: 'mi-producto',
        brand: 'Mi Marca',
        status: 'DRAFT',
        seoTitle: '',
        seoDescription: '',
        urlSlug: '',
        ogImageUrl: '',
      },
    };

    const result = mapFormStateToActionInput(formState, storeId);

    expect(result.storeId).toBe(storeId);
    expect(result.basicInfo.name).toBe('Mi Producto');
    expect(result.basicInfo.slug).toBe('mi-producto');
    expect(result.basicInfo.brand).toBe('Mi Marca');
    expect(result.basicInfo.status).toBe('DRAFT');

    // Empty SEO fields should be undefined
    expect(result.basicInfo.seoTitle).toBeUndefined();
    expect(result.basicInfo.seoDescription).toBeUndefined();

    // No variants, images, or digital product
    expect(result.attributes).toBeUndefined();
    expect(result.variants).toBeUndefined();
    expect(result.images).toBeUndefined();
    expect(result.digitalProduct).toBeUndefined();
  });

  it('should map form state with variants and attributes correctly', () => {
    const formState: CreateProductFormState = {
      ...CREATE_PRODUCT_INITIAL_VALUES,
      basicInfo: {
        name: 'Camiseta',
        description: 'Camiseta deportiva',
        slug: 'camiseta',
        brand: '',
        status: 'ACTIVE',
        seoTitle: 'Camiseta SEO',
        seoDescription: '',
        urlSlug: '',
        ogImageUrl: '',
      },
      variants: {
        hasVariants: true,
        options: [
          {
            id: 'opt-1',
            name: 'Talla',
            type: 'TEXT',
            values: [
              { id: 'val-1', value: 'S' },
              { id: 'val-2', value: 'M' },
            ],
          },
        ],
        variants: [
          {
            id: 'var-12345678-rest',
            sku: 'CAM-S',
            price: 29.99,
            promotionalPrice: 24.99,
            cost: 10,
            attributeValueIds: ['val-1'],
            attributeCombination: 'S',
            isEnabled: true,
          },
          {
            id: 'var-87654321-rest',
            sku: '',
            price: 29.99,
            promotionalPrice: null,
            cost: null,
            attributeValueIds: ['val-2'],
            attributeCombination: 'M',
            isEnabled: true,
          },
        ],
      },
    };

    const result = mapFormStateToActionInput(formState, storeId);

    // Attributes should be mapped
    expect(result.attributes).toHaveLength(1);
    expect(result.attributes![0].name).toBe('Talla');
    expect(result.attributes![0].values).toEqual(['S', 'M']);

    // Variants should be mapped (both enabled)
    expect(result.variants).toHaveLength(2);
    expect(result.variants![0].sku).toBe('CAM-S');
    expect(result.variants![0].price).toBe(29.99);
    expect(result.variants![0].promotionalPrice).toBe(24.99);
    expect(result.variants![0].cost).toBe(10);

    // Second variant has no SKU, should get auto-generated
    expect(result.variants![1].sku).toContain('SKU-');
    expect(result.variants![1].promotionalPrice).toBeUndefined();
    expect(result.variants![1].cost).toBeUndefined();

    // SEO title should be present when non-empty
    expect(result.basicInfo.seoTitle).toBe('Camiseta SEO');
  });

  it('should map digital product configuration when isDigital is true', () => {
    const expirationDate = new Date('2026-12-31');
    const formState: CreateProductFormState = {
      ...CREATE_PRODUCT_INITIAL_VALUES,
      basicInfo: {
        name: 'Ebook',
        description: 'Un libro digital',
        slug: 'ebook',
        brand: '',
        status: 'DRAFT',
        seoTitle: '',
        seoDescription: '',
        urlSlug: '',
        ogImageUrl: '',
      },
      configurations: {
        isDigital: true,
        trackInventory: false,
        isFeatured: false,
        isNew: true,
        isOnSale: false,
        allowPromotions: true,
        physical: null,
        digital: {
          downloadUrl: 'https://example.com/ebook.pdf',
          fileName: 'ebook.pdf',
          fileType: 'PDF',
          fileSize: 15.5,
          expirationDate,
          downloadLimit: 3,
        },
      },
    };

    const result = mapFormStateToActionInput(formState, storeId);

    expect(result.basicInfo.isDigital).toBe(true);
    expect(result.basicInfo.trackInventory).toBe(false);
    expect(result.basicInfo.isNew).toBe(true);
    expect(result.digitalProduct).toBeDefined();
    expect(result.digitalProduct!.downloadUrl).toBe('https://example.com/ebook.pdf');
    expect(result.digitalProduct!.fileName).toBe('ebook.pdf');
    expect(result.digitalProduct!.fileType).toBe('PDF');
    expect(result.digitalProduct!.fileSize).toBe(15.5);
    expect(result.digitalProduct!.expirationDate).toEqual(expirationDate);
    expect(result.digitalProduct!.downloadLimit).toBe(3);
  });

  it('should exclude disabled variants from the action input', () => {
    const formState: CreateProductFormState = {
      ...CREATE_PRODUCT_INITIAL_VALUES,
      basicInfo: {
        name: 'Producto',
        description: '',
        slug: 'producto',
        brand: '',
        status: 'DRAFT',
        seoTitle: '',
        seoDescription: '',
        urlSlug: '',
        ogImageUrl: '',
      },
      variants: {
        hasVariants: true,
        options: [
          {
            id: 'opt-1',
            name: 'Color',
            type: 'TEXT',
            values: [
              { id: 'val-1', value: 'Rojo' },
              { id: 'val-2', value: 'Azul' },
            ],
          },
        ],
        variants: [
          {
            id: 'var-11111111-rest',
            sku: 'RED-01',
            price: 50,
            promotionalPrice: null,
            cost: null,
            attributeValueIds: ['val-1'],
            attributeCombination: 'Rojo',
            isEnabled: true,
          },
          {
            id: 'var-22222222-rest',
            sku: 'BLU-01',
            price: 50,
            promotionalPrice: null,
            cost: null,
            attributeValueIds: ['val-2'],
            attributeCombination: 'Azul',
            isEnabled: false,
          },
        ],
      },
    };

    const result = mapFormStateToActionInput(formState, storeId);

    // Only enabled variant should be included
    expect(result.variants).toHaveLength(1);
    expect(result.variants![0].sku).toBe('RED-01');
  });

  it('should map images with position and primary flag', () => {
    const formState: CreateProductFormState = {
      ...CREATE_PRODUCT_INITIAL_VALUES,
      basicInfo: {
        name: 'Producto con imagenes',
        description: '',
        slug: 'producto-imagenes',
        brand: '',
        status: 'DRAFT',
        seoTitle: '',
        seoDescription: '',
        urlSlug: '',
        ogImageUrl: '',
      },
      media: {
        images: [
          {
            id: 'img-1',
            url: 'https://example.com/img1.jpg',
            altText: 'Imagen principal',
            position: 0,
            isPrimary: true,
          },
          {
            id: 'img-2',
            url: 'https://example.com/img2.jpg',
            altText: 'Imagen secundaria',
            position: 1,
            isPrimary: false,
          },
        ],
      },
    };

    const result = mapFormStateToActionInput(formState, storeId);

    expect(result.images).toHaveLength(2);
    expect(result.images![0].url).toBe('https://example.com/img1.jpg');
    expect(result.images![0].isPrimary).toBe(true);
    expect(result.images![0].position).toBe(0);
    expect(result.images![1].url).toBe('https://example.com/img2.jpg');
    expect(result.images![1].isPrimary).toBe(false);
    expect(result.images![1].position).toBe(1);
  });
});

describe('CREATE_PRODUCT_INITIAL_VALUES', () => {
  it('should have correct default values for all form sections', () => {
    const initial = CREATE_PRODUCT_INITIAL_VALUES;

    // Basic info defaults
    expect(initial.basicInfo.name).toBe('');
    expect(initial.basicInfo.status).toBe('DRAFT');

    // Media defaults
    expect(initial.media.images).toHaveLength(0);

    // Variants defaults
    expect(initial.variants.hasVariants).toBe(false);
    expect(initial.variants.options).toHaveLength(0);
    expect(initial.variants.variants).toHaveLength(0);

    // Configuration defaults
    expect(initial.configurations.isDigital).toBe(false);
    expect(initial.configurations.trackInventory).toBe(true);
    expect(initial.configurations.isFeatured).toBe(false);
    expect(initial.configurations.isNew).toBe(true);
    expect(initial.configurations.allowPromotions).toBe(true);
    expect(initial.configurations.digital).toBeNull();
    expect(initial.configurations.physical).not.toBeNull();
  });
});
