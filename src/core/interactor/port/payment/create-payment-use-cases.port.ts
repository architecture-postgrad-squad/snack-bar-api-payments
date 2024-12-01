import { ClientDto } from '@/transport/dto/client/client.dto';
import { Payment } from '@/core/domain/payment/payment.entity';

export abstract class CreatePixPaymentUseCasesPort {
  abstract execute(
    payment: Payment,
    client: ClientDto,
    orderId: string,
  ): Promise<Payment>;
}
