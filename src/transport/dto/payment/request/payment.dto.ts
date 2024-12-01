import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';

import { ClientDto } from '@/transport/dto/client/client.dto';
import { Payment } from '@/core/domain/payment/payment.entity';
import { PAYMENT } from '@/transport/constant/payment.constant';

const { VALUE, METHOD } = PAYMENT.API_PROPERTY.PAYMENT;

export class CreatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: VALUE.DESC,
    example: VALUE.EXAMPLE,
    required: true,
  })
  readonly value: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: METHOD.DESC,
    example: METHOD.EXAMPLE,
    required: true,
  })
  readonly method: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Order identifier in database',
    example: '5671843b-324b-40ae-aaa8-a3b404013703',
    required: true,
  })
  readonly orderId: string;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Details about the client making the payment.',
    type: ClientDto,
    required: true,
  })
  readonly client: ClientDto;
}

export const toDomain = (dto: CreatePaymentDto): Payment => {
  return new Payment(null, dto.value, dto.method, null);
};
