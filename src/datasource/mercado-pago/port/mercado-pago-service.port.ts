import { ClientDto } from '@/transport/dto/client/client.dto';
import { Payment } from '@/core/domain/payment/payment.entity';

export abstract class MercadoPagoServicePort {
  abstract createPayment(payment: Payment, client: ClientDto): Promise<Payment>;
  abstract getPaymentById(identifier: string): Promise<Payment>;
}
