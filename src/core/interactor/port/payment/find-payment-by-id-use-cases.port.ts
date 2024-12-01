import { Payment } from '@/core/domain/payment/payment.entity';

export abstract class FindPaymentByIdUseCasesPort {
  abstract execute(id: string): Promise<Payment>;
}
