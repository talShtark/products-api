import { InMemoryProductRepository } from './in-memoty-product.repository';
import { Logger } from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { ProductNameAlreadyExistsException } from '../exceptions/ProductNameAlreadyExists.exception';
import { ProductNotFoundException } from '../exceptions/ProductNotFound.exception';
import { ProductHasPendingOrdersException } from '../exceptions/ProductHasPendingOrders.exception';

describe('InMemoryProductRepository', () => {
  let repository: InMemoryProductRepository;
  let mockLogger: Logger;

  beforeEach(() => {
    mockLogger = new Logger();
    jest.spyOn(mockLogger, 'verbose').mockImplementation(() => {});
    repository = new InMemoryProductRepository(mockLogger);
  });

  describe('create', () => {
    it('should create a new product when no duplicate name exists', async () => {
      const newProduct: Product = {
        id: null,
        name: 'New Product',
        description: 'A new product',
        stock: 100,
        createdAt: new Date(),
        itemsSold: 0,
        hasPendingOrders: false,
      };
      const createdProduct = await repository.create(newProduct);
      expect(createdProduct.name).toBe('New Product');
      expect(createdProduct.id).not.toBeNull();
    });

    it('should throw an error if product name already exists', async () => {
      const existingProduct: Product = {
        id: 1,
        name: 'Existing Product',
        description: 'An existing product',
        stock: 50,
        createdAt: new Date(),
        itemsSold: 0,
        hasPendingOrders: false,
      };
      await repository.create(existingProduct);

      const newProductWithSameName: Product = {
        id: null,
        name: 'Existing Product',
        description: 'Another product',
        stock: 50,
        createdAt: new Date(),
        itemsSold: 0,
        hasPendingOrders: false,
      };
      await expect(repository.create(newProductWithSameName)).rejects.toThrow(
        ProductNameAlreadyExistsException,
      );
    });
  });

  describe('update', () => {
    it('should update product details', async () => {
      const product = await repository.create({
        id: null,
        name: 'Initial Product',
        description: '',
        stock: 10,
        createdAt: new Date(),
        itemsSold: 0,
        hasPendingOrders: false,
      });
      const updatedProduct = await repository.update(product.id, {
        description: 'Updated Description',
      });
      expect(updatedProduct.description).toBe('Updated Description');
    });

    it('should throw an error if the product does not exist', async () => {
      await expect(
        repository.update(999, { name: 'Nonexistent' }),
      ).rejects.toThrow(ProductNotFoundException);
    });

    it('should throw an error if updating to a name that already exists', async () => {
      await repository.create({
        id: null,
        name: 'Product 1',
        hasPendingOrders: false,
        description: '',
        stock: 10,
        createdAt: new Date(),
        itemsSold: 0,
      });
      const product2 = await repository.create({
        id: null,
        hasPendingOrders: false,
        name: 'Product 2',
        description: '',
        stock: 20,
        createdAt: new Date(),
        itemsSold: 0,
      });

      await expect(
        repository.update(product2.id, { name: 'Product 1' }),
      ).rejects.toThrow(ProductNameAlreadyExistsException);
    });
  });

  describe('delete', () => {
    it('should delete a product without pending orders', async () => {
      const product = await repository.create({
        id: null,
        hasPendingOrders: false,
        name: 'Delete Me',
        description: '',
        stock: 10,
        createdAt: new Date(),
        itemsSold: 0,
      });
      await repository.delete(product.id);

      await expect(
        repository.update(product.id, { description: 'Try update' }),
      ).rejects.toThrow(ProductNotFoundException);
    });

    it('should throw an error if trying to delete a product with pending orders', async () => {
      const product = await repository.create({
        id: null,
        hasPendingOrders: true,
        name: 'Popular Product',
        description: '',
        stock: 10,
        createdAt: new Date(),
        itemsSold: 5,
      });
      await expect(repository.delete(product.id)).rejects.toThrow(
        ProductHasPendingOrdersException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all products with default pagination when no options are provided', async () => {
      await repository.create({
        id: null,
        hasPendingOrders: false,
        name: 'Product A',
        description: 'Desc A',
        stock: 10,
        createdAt: new Date(),
        itemsSold: 0,
      });
      await repository.create({
        id: null,
        hasPendingOrders: false,
        name: 'Product B',
        description: 'Desc B',
        stock: 20,
        createdAt: new Date(),
        itemsSold: 0,
      });

      const products = await repository.findAll();
      expect(products.length).toBe(2);
      expect(products[0].name).toBe('Product A'); // Assuming default sort is by createdAt ascending
    });

    it('should filter products by name and description', async () => {
      await repository.create({
        id: null,
        name: 'Alpha',
        description: 'First',
        stock: 10,
        hasPendingOrders: false,
        createdAt: new Date(),
        itemsSold: 0,
      });
      await repository.create({
        id: null,
        name: 'Beta',
        hasPendingOrders: false,
        description: 'Second',
        stock: 20,
        createdAt: new Date(),
        itemsSold: 0,
      });

      const filteredByName = await repository.findAll({
        search: { name: 'alpha' },
      });
      const filteredByDescription = await repository.findAll({
        search: { description: 'second' },
      });

      expect(filteredByName.length).toBe(1);
      expect(filteredByName[0].name).toBe('Alpha');
      expect(filteredByDescription.length).toBe(1);
      expect(filteredByDescription[0].description).toBe('Second');
    });

    it('should apply sorting by stock in descending order', async () => {
      await repository.create({
        id: null,
        name: 'Product C',
        description: 'Desc C',
        stock: 5,
        createdAt: new Date(),
        itemsSold: 0,
        hasPendingOrders: false,
      });
      await repository.create({
        id: null,
        hasPendingOrders: false,
        name: 'Product D',
        description: 'Desc D',
        stock: 15,
        createdAt: new Date(),
        itemsSold: 0,
      });

      const sorted = await repository.findAll({
        sort: { sortBy: 'stock', sortOrder: 'desc' },
      });
      expect(sorted[0].name).toBe('Product D');
      expect(sorted[1].name).toBe('Product C');
    });
  });

  describe('findLowStock', () => {
    it('should return products with stock below the specified threshold', async () => {
      await repository.create({
        id: null,
        name: 'Low Stock 1',
        description: 'Low',
        hasPendingOrders: false,
        stock: 2,
        createdAt: new Date(),
        itemsSold: 0,
      });
      await repository.create({
        id: null,
        hasPendingOrders: false,
        name: 'Low Stock 2',
        description: 'Lower',
        stock: 3,
        createdAt: new Date(),
        itemsSold: 0,
      });
      await repository.create({
        id: null,
        name: 'High Stock',
        hasPendingOrders: false,
        description: 'High',
        stock: 10,
        createdAt: new Date(),
        itemsSold: 0,
      });

      const lowStockProducts = await repository.findLowStock(5);
      expect(lowStockProducts.length).toBe(2);
      expect(lowStockProducts[0].name).toMatch(/Low Stock/); // Check that product names include "Low Stock"
    });
  });

  describe('findMostPopular', () => {
    it('should return the most popular products based on items sold', async () => {
      await repository.create({
        id: null,
        name: 'Popular 1',
        hasPendingOrders: false,
        description: 'Desc P1',
        stock: 10,
        createdAt: new Date(),
        itemsSold: 100,
      });
      await repository.create({
        id: null,
        name: 'Popular 2',
        hasPendingOrders: false,
        description: 'Desc P2',
        stock: 20,
        createdAt: new Date(),
        itemsSold: 50,
      });
      await repository.create({
        id: null,
        name: 'Popular 3',
        hasPendingOrders: false,
        description: 'Desc P3',
        stock: 30,
        createdAt: new Date(),
        itemsSold: 25,
      });

      const mostPopular = await repository.findMostPopular(2);
      expect(mostPopular.length).toBe(2);
      expect(mostPopular[0].name).toBe('Popular 1');
      expect(mostPopular[1].name).toBe('Popular 2');
    });
  });
});
