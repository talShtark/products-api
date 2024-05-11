import { Product } from '../entities/product.entity';

export interface ProductRepository {
  create(product: Product): Promise<Product>;
  update(id: number, product: Partial<Product>): Promise<Product>;
  delete(id: number): Promise<void>;
  findAll(options?: {
    page?: number;
    limit?: number;
    sortBy?: keyof Product;
    sortOrder?: 'asc' | 'desc';
    search?: {
      name?: string;
      description?: string;
    };
  }): Promise<Product[]>;
  findLowStock(threshold: number): Promise<Product[]>;
  findMostPopular(limit: number): Promise<Product[]>;
}
