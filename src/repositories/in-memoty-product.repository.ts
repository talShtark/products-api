import { Injectable, Logger } from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { ProductRepository } from './product-repository.ifc';
import { ProductNameAlreadyExistsException } from '../exceptions/ProductNameAlreadyExists.exception';
import { ProductNotFoundException } from '../exceptions/ProductNotFound.exception';
import { ProductHasPendingOrdersException } from '../exceptions/ProductHasPendingOrders.exception';
import { productsData } from '../data/products.data';

@Injectable()
export class InMemoryProductRepository implements ProductRepository {
  private readonly products: Product[]; // Load initial data from products.data.json

  constructor(private readonly logger: Logger) {
    this.logger.verbose(
      'Initializing InMemoryProductRepository with initial data...',
    );
    this.products = [...productsData];
  }

  async create(product: Product): Promise<Product> {
    const isAlreadyExistByName = this.products.find(
      (p) => p.name.toLowerCase() === product.name.toLowerCase(),
    );

    if (isAlreadyExistByName) {
      throw new ProductNameAlreadyExistsException(product.name);
    }

    product.id = this.generateUniqueId();
    product.createdAt = new Date();
    product.itemsSold = 0;

    this.products.push(product);

    return product;
  }

  async update(id: number, productData: Partial<Product>): Promise<Product> {
    const productIndex = this.findProductIndexByIdOrThrow(id);

    const product = this.products[productIndex];

    if (
      productData.name &&
      product.name.toLowerCase() !== productData.name.toLowerCase()
    ) {
      const existingProduct = this.products.find(
        (p) => p.name.toLowerCase() === productData.name.toLowerCase(),
      );

      if (existingProduct) {
        throw new ProductNameAlreadyExistsException(productData.name);
      }
    }

    this.products[productIndex] = {
      ...product,
      ...productData,
    };

    return this.products[productIndex];
  }

  async delete(id: number): Promise<void> {
    const productIndex = this.findProductIndexByIdOrThrow(id);

    const product = this.products[productIndex];

    const hasPendingOrders = this.checkForPendingOrders(product);
    console.log('*******************');
    console.log({ product, hasPendingOrders });
    console.log('*******************');

    if (hasPendingOrders) {
      throw new ProductHasPendingOrdersException(id);
    }

    this.products.splice(productIndex, 1);
  }

  private findProductIndexByIdOrThrow(id: number): number {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      throw new ProductNotFoundException(id);
    }
    return productIndex;
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    sort?: {
      sortBy?: keyof Product;
      sortOrder?: 'asc' | 'desc';
    };
    search?: {
      name?: string;
      description?: string;
    };
  }): Promise<Product[]> {
    let filteredProducts = [...this.products];

    if (options?.search) {
      const { name, description } = options.search;
      filteredProducts = filteredProducts.filter((product) => {
        const nameMatch =
          !name || product.name.toLowerCase().includes(name.toLowerCase());
        const descriptionMatch =
          !description ||
          product.description.toLowerCase().includes(description.toLowerCase());
        return nameMatch && descriptionMatch;
      });
    }

    const sortBy = options?.sort?.sortBy || 'createdAt';
    const sortOrder = options?.sort?.sortOrder === 'asc' ? 1 : -1;

    filteredProducts.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return -1 * sortOrder;
      if (a[sortBy] > b[sortBy]) return 1 * sortOrder;
      return 0;
    });

    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    filteredProducts = filteredProducts.slice(startIndex, endIndex);

    return filteredProducts;
  }

  private checkForPendingOrders(product: Product): boolean {
    return product.hasPendingOrders;
  }

  async findLowStock(threshold: number): Promise<Product[]> {
    return this.products.filter((product) => product.stock < threshold);
  }

  async findMostPopular(limit: number): Promise<Product[]> {
    const sortedProducts = [...this.products].sort(
      (a, b) => b.itemsSold - a.itemsSold,
    );
    return sortedProducts.slice(0, limit);
  }

  private generateUniqueId(): number {
    return this.products.length + 1;
  }
}
