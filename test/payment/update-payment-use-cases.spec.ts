import { Payment } from '@/core/domain/payment/payment.entity';
import { StatusEnum as PaymentStatusEnum } from '@/core/domain/payment/status.entity';
import { UpdatePaymentUseCase } from '@/core/interactor/usecases/payment/update-payment.use-cases';
import { IPaymentRepository } from '@/core/repository/payment/payment.repository';
import { MercadoPagoServicePort } from '@/datasource/mercado-pago/port/mercado-pago-service.port';
import { OrderServicePort } from '@/datasource/order-service/port/order-service.port';

describe('UpdatePaymentUseCase', () => {
  let service: UpdatePaymentUseCase;
  let paymentRepository: jest.Mocked<IPaymentRepository>;
  let mercadoPagoAdapterService: jest.Mocked<MercadoPagoServicePort>;
  let orderService: jest.Mocked<OrderServicePort>;

  beforeEach(() => {
    paymentRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      updateById: jest.fn(),
    } as jest.Mocked<IPaymentRepository>;

    mercadoPagoAdapterService = {
      createPayment: jest.fn(),
      getPaymentById: jest.fn(),
    } as jest.Mocked<MercadoPagoServicePort>;

    orderService = {
      getOrderByPaymentId: jest.fn(),
      updateOrderStatus: jest.fn(),
    } as jest.Mocked<OrderServicePort>;

    service = new UpdatePaymentUseCase(
      paymentRepository,
      mercadoPagoAdapterService,
      orderService,
    );
  });

  it('should fetch payment data from Mercado Pago API and update database register', async () => {
    const payment: Payment = {
      id: '122',
      value: 100,
      method: 'PIX',
      externalId: '123',
      status: PaymentStatusEnum.APPROVED,
      createdAt: new Date(),
    };

    const order = {
      id: '1',
      status: 'WAITING_PAYMENT',
      paymentId: payment.id,
      orderCode: 1,
      clientId: '123',
      createdAt: new Date(),
    };

    jest
      .spyOn(mercadoPagoAdapterService, 'getPaymentById')
      .mockResolvedValue(payment);
    jest.spyOn(paymentRepository, 'updateById').mockResolvedValue(payment);
    jest.spyOn(orderService, 'getOrderByPaymentId').mockResolvedValue(order);
    jest.spyOn(orderService, 'updateOrderStatus').mockResolvedValue(undefined);

    const result = await service.execute('122');

    expect(result).toMatchObject({
      message: 'Payment register was updated successfully',
    });
    expect(paymentRepository.updateById).toHaveBeenCalledWith(
      payment.id,
      payment,
    );
    expect(orderService.updateOrderStatus).toHaveBeenCalledWith(
      expect.any(String),
      'RECEIVED',
    );
    expect(mercadoPagoAdapterService.getPaymentById).toHaveBeenCalledWith(
      '122',
    );
  });

  it('should handle errors when Mercado Pago API is not responsive', async () => {
    mercadoPagoAdapterService.getPaymentById.mockRejectedValue(
      new Error('Failed to update payment'),
    );

    await expect(service.execute('122')).rejects.toThrow(
      new Error('Failed to update payment'),
    );
  });
});
