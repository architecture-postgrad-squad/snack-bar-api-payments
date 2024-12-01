import { UpdatePaymentResponseDto } from '@/transport/dto/payment/response/update-success-response.dto';

export abstract class UpdatePaymentServicePort {
  abstract execute(id: string): Promise<UpdatePaymentResponseDto>;
}
