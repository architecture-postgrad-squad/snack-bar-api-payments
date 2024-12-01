import { Payment } from '@/core/domain/payment/payment.entity';
import { StatusEnum as PaymentStatusEnum } from '@/core/domain/payment/status.entity';

import { CreatePaymentUseCases } from '@/core/interactor/usecases/payment/create-pix-payment.use-cases';
import { IPaymentRepository } from '@/core/repository/payment/payment.repository';
import { MercadoPagoServicePort } from '@/datasource/mercado-pago/port/mercado-pago-service.port';
import { OrderServicePort } from '@/datasource/order-service/port/order-service.port';
import {
  CreatePaymentDto,
  toDomain,
} from '@/transport/dto/payment/request/payment.dto';

describe('CreatePaymentUseCases', () => {
  let useCase: CreatePaymentUseCases;
  let paymentRepository: IPaymentRepository;
  let mercadoPagoService: MercadoPagoServicePort;
  let orderService: OrderServicePort;

  beforeEach(async () => {
    paymentRepository = {
      create: jest.fn((payment) =>
        Promise.resolve({ ...payment, id: 'some-id', createdAt: new Date() }),
      ),
      findById: jest.fn(),
      updateById: jest.fn(),
    };

    mercadoPagoService = {
      createPayment: jest.fn(),
      getPaymentById: jest.fn(),
    };

    orderService = {
      updateOrderStatus: jest.fn(() => Promise.resolve()),
      getOrderByPaymentId: jest.fn(),
    };

    useCase = new CreatePaymentUseCases(
      paymentRepository,
      mercadoPagoService,
      orderService,
    );
  });

  it('should create a payment and return it', async () => {
    const paymentDto: CreatePaymentDto = {
      value: 100,
      method: 'Credit Card',
      orderId: '1',
      client: {
        id: '1',
        name: 'Gandalf The Grey',
        email: 'galdanf@totr.com',
        cpf: '12345678900',
        isValid: jest.fn(),
      },
    };

    const expectedPayment: Payment = {
      ...paymentDto,
      id: 'some-id',
      externalId: 'some-id',
      status: PaymentStatusEnum.PENDING,
      createdAt: expect.any(Date),
    };

    jest.spyOn(paymentRepository, 'create').mockResolvedValue(expectedPayment);
    jest
      .spyOn(mercadoPagoService, 'createPayment')
      .mockResolvedValue(expectedPayment);
    jest.spyOn(orderService, 'updateOrderStatus').mockResolvedValue(undefined);

    const result = await useCase.execute(
      toDomain(paymentDto),
      paymentDto.client,
      paymentDto.orderId,
    );

    expect(result).toEqual(expectedPayment);
    expect(paymentRepository.create).toHaveBeenCalledWith(toDomain(paymentDto));
    expect(orderService.updateOrderStatus).toHaveBeenCalledWith(
      paymentDto.orderId,
      'WAITING_PAYMENT',
    );
  });

  it('should handle errors when creating a payment', async () => {
    const paymentDto: CreatePaymentDto = {
      value: 100,
      method: 'Credit Card',
      orderId: '1',
      client: {
        id: '1',
        name: 'Gandalf The Grey',
        email: 'galdanf@totr.com',
        cpf: '12345678900',
        isValid: jest.fn(),
      },
    };

    jest
      .spyOn(paymentRepository, 'create')
      .mockRejectedValue(new Error('Failed to create payment'));
    await expect(
      useCase.execute(
        toDomain(paymentDto),
        paymentDto.client,
        paymentDto.orderId,
      ),
    ).rejects.toThrow(Error);
  });
});
