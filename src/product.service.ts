import { Injectable, Inject } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { PRODUCT_REPOSITORY } from './repositories/tokens';
import { ProductRepository } from './repositories/product-repository.ifc';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = new Product();
    product.name = createProductDto.name;
    product.description = createProductDto.description;
    product.stock = createProductDto.stock;

    return this.productRepository.create(product);
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productRepository.update(id, updateProductDto);
  }

  async delete(id: number): Promise<void> {
    return this.productRepository.delete(id);
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    sortBy?: keyof Product;
    sortOrder?: 'asc' | 'desc';
    search?: {
      name?: string;
      description?: string;
    };
  }): Promise<Product[]> {
    return this.productRepository.findAll(options);
  }

  async findLowStock(threshold: number): Promise<Product[]> {
    return this.productRepository.findLowStock(threshold);
  }

  async findMostPopular(limit: number): Promise<Product[]> {
    return this.productRepository.findMostPopular(limit);
  }
}
