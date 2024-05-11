import { Logger, Module } from '@nestjs/common';
import { ProductsController } from './product.controller';
import { ProductsService } from './product.service';
import { PRODUCT_REPOSITORY } from './repositories/tokens';
import { InMemoryProductRepository } from './repositories/in-memoty-product.repository';

@Module({
  controllers: [ProductsController],
  providers: [
    Logger,
    ProductsService,
    { provide: PRODUCT_REPOSITORY, useClass: InMemoryProductRepository },
  ],
})
export class AppModule {}
