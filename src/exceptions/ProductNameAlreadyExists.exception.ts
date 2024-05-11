import { HttpException, HttpStatus } from '@nestjs/common';

export class ProductNameAlreadyExistsException extends HttpException {
  constructor(name: string) {
    super(`Product with name '${name}' already exists`, HttpStatus.BAD_REQUEST);
  }
}
