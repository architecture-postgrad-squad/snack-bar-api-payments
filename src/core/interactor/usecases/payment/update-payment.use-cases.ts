import { Payment } from '@/core/domain/payment/payment.entity';
import { StatusEnum as PaymentStatusEnum } from '@/core/domain/payment/status.entity';
import { InternalServerErrorException } from '@/core/exceptions/custom-exceptions/internal-server-error.exception';
import { UpdatePaymentServicePort } from '@/core/interactor/port/payment/update-payment-service.port';
import { IPaymentRepository } from '@/core/repository/payment/payment.repository';
import { MercadoPagoServicePort } from '@/datasource/mercado-pago/port/mercado-pago-service.port';
import { UpdatePaymentResponseDto } from '@/transport/dto/payment/response/update-success-response.dto';
import { OrderServicePort } from '@/datasource/order-service/port/order-service.port';

export class UpdatePaymentUseCase implements UpdatePaymentServicePort {
  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly mercadoPagoAdapterService: MercadoPagoServicePort,
    private readonly orderService: OrderServicePort,
  ) {}

  async execute(id: string): Promise<UpdatePaymentResponseDto> {
    try {
      const payment = await this.fetchPayment(id);
      if (payment.status === PaymentStatusEnum.APPROVED) {
        await this.updateOrder(payment);
      }

      const paymentRegister = await this.updatePaymentRegister(payment);

      return paymentRegister;
    } catch (error) {
      throw new InternalServerErrorException({
        description: 'Failed to update payment',
        details: error.message,
      });
    }
  }

  private async fetchPayment(id: string): Promise<Payment> {
    return await this.mercadoPagoAdapterService.getPaymentById(id);
  }

  private async updatePaymentRegister(
    payment: Payment,
  ): Promise<UpdatePaymentResponseDto> {
    try {
      await this.paymentRepository.updateById(payment.id, payment);
    } catch (error) {
      throw new InternalServerErrorException({
        description: 'Failed to update payment record in repository',
      });
    }
    return { message: 'Payment register was updated successfully' };
  }

  private async updateOrder(payment: Payment): Promise<void> {
    try {
      const order = await this.orderService.getOrderByPaymentId(payment.id);
      await this.orderService.updateOrderStatus(order.id, 'RECEIVED');
    } catch (error) {
      throw new InternalServerErrorException({
        description: 'Failed to update order',
      });
    }
  }
}
