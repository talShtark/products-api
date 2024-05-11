import { HttpException, HttpStatus } from '@nestjs/common';

export class ProductHasPendingOrdersException extends HttpException {
  constructor(id: number) {
    super(
      `Product with id '${id}' has pending orders and cannot be deleted`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
