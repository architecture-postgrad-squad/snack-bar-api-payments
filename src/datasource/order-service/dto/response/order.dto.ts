import { ApiProperty } from '@nestjs/swagger';

export class OrderDTO {
  @ApiProperty({ example: 'd7e8f8a8-7c6b-4c6d-8c88-2f9b64f85b8c' })
  readonly id: string;

  @ApiProperty({ example: '12345' })
  readonly clientId?: string;

  @ApiProperty({ example: '67890' })
  readonly paymentId?: string;

  @ApiProperty({ example: 'Aguardando Pagamento' })
  readonly status: string;

  @ApiProperty({ example: '2023-11-30T12:34:56Z' })
  readonly createdAt: Date;

  @ApiProperty({ example: 1001 })
  readonly orderCode: number;
}
