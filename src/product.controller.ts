import {
  Controller,
  Get,
  Post,
  Query,
  Put,
  Body,
  Param,
  Delete,
  UsePipes,
  ParseIntPipe,
} from '@nestjs/common';
import { Product } from './entities/product.entity';
import { ProductsService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  @UsePipes(new ParseIntPipe())
  async update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UsePipes(new ParseIntPipe())
  async delete(@Param('id') id: number): Promise<void> {
    return this.productsService.delete(id);
  }

  @Get()
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: keyof Product,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('search') search?: string,
  ): Promise<Product[]> {
    const options = {
      page,
      limit,
      sortBy,
      sortOrder,
      search: search ? JSON.parse(search) : undefined,
    };
    return this.productsService.findAll(options);
  }

  @Get('lowStock')
  async findLowStock(
    @Query('threshold') threshold: number,
  ): Promise<Product[]> {
    return this.productsService.findLowStock(threshold);
  }

  @Get('popular')
  async findMostPopular(@Query('limit') limit: number): Promise<Product[]> {
    return this.productsService.findMostPopular(limit);
  }
}
