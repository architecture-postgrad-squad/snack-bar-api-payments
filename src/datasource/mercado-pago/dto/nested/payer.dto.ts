import { MercadoPagoIdentificationDto } from '@/datasource/mercado-pago/dto/nested/identification.dto';

export class MercadoPagoPayerDto {
  readonly id: string;
  readonly email: string;
  readonly identification: MercadoPagoIdentificationDto;
  readonly type: string;
}
