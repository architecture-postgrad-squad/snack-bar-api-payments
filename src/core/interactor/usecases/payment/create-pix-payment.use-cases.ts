import { ClientDto } from '@/transport/dto/client/client.dto';
import { Payment } from '@/core/domain/payment/payment.entity';
import { InternalServerErrorException } from '@/core/exceptions/custom-exceptions/internal-server-error.exception';
import { CreatePixPaymentUseCasesPort } from '@/core/interactor/port/payment/create-payment-use-cases.port';
import { IPaymentRepository } from '@/core/repository/payment/payment.repository';
import { MercadoPagoServicePort } from '@/datasource/mercado-pago/port/mercado-pago-service.port';
import { OrderServicePort } from '@/datasource/order-service/port/order-service.port';

export class CreatePaymentUseCases implements CreatePixPaymentUseCasesPort {
  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly mercadoPagoAdapterService: MercadoPagoServicePort,
    private readonly orderService: OrderServicePort,
  ) {}

  async execute(
    payment: Payment,
    client: ClientDto,
    orderId: string,
  ): Promise<Payment> {
    try {
      const createdPayment = await this.paymentRepository.create(payment);

      const externalPayment =
        await this.mercadoPagoAdapterService.createPayment(
          createdPayment,
          client,
        );

      await this.orderService.updateOrderStatus(orderId, 'WAITING_PAYMENT');

      return externalPayment;
    } catch (error) {
      throw new InternalServerErrorException({
        description: 'Failed to create payment',
        details: error.message,
      });
    }
  }
}
