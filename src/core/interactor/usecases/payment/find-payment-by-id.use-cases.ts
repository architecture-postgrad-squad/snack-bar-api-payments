import { NotFoundException } from '@/core/exceptions/custom-exceptions/not-found.exception';
import { FindPaymentByIdUseCasesPort } from '@/core/interactor/port/payment/find-payment-by-id-use-cases.port';
import { IPaymentRepository } from '@/core/repository/payment/payment.repository';

export class FindPaymentByIdUseCases implements FindPaymentByIdUseCasesPort {
  constructor(private readonly paymentRepository: IPaymentRepository) {}

  async execute(id: string) {
    try {
      return await this.paymentRepository.findById(id);
    } catch (error) {
      throw new NotFoundException({ description: 'Payment not found' });
    }
  }
}
