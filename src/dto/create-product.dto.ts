import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  description: string;

  @IsNotEmpty()
  @IsInt()
  stock: number;
}
