import { IsArray, IsInt, IsOptional, IsString, IsUUID, Min, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDto {
  @ApiProperty({ example: 'a5f40d31-98ba-4924-b325-e84a82562ed5' })
  @IsUUID()
  productId: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class ShippingAddressDto {
  @ApiProperty({ example: 'Anna Nagar' })
  @IsString()
  street: string;

  @ApiProperty({ example: 'Tiruchirappalli' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Tamil Nadu' })
  @IsString()
  state: string;

  @ApiProperty({ example: '620001' })
  @IsString()
  pincode: string;

  @ApiProperty({ example: '9876543210' })
  @IsString()
  phone: string;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ type: ShippingAddressDto })
  @IsObject()
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;

  @ApiProperty({ example: 'COD', required: false })
  @IsOptional()
  @IsString()
  paymentMethod?: string;
}
