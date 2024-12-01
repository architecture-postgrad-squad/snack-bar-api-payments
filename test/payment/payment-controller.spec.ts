import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from '@/transport/controller/payment.controller';
import { CreatePixPaymentUseCasesPort } from '@/core/interactor/port/payment/create-payment-use-cases.port';
import { FindPaymentByIdUseCasesPort } from '@/core/interactor/port/payment/find-payment-by-id-use-cases.port';
import { UpdatePaymentServicePort } from '@/core/interactor/port/payment/update-payment-service.port';
import { CreatePaymentDto } from '@/transport/dto/payment/request/payment.dto';
import { Payment } from '@/core/domain/payment/payment.entity';
import { StatusEnum } from '@/core/domain/payment/status.entity';

describe('PaymentController', () => {
  let controller: PaymentController;
  let createPaymentUseCases: jest.Mocked<CreatePixPaymentUseCasesPort>;
  let findPaymentByIdUseCases: jest.Mocked<FindPaymentByIdUseCasesPort>;
  let updatePaymentService: jest.Mocked<UpdatePaymentServicePort>;

  beforeEach(async () => {
    createPaymentUseCases = {
      execute: jest.fn(),
    } as jest.Mocked<CreatePixPaymentUseCasesPort>;
    findPaymentByIdUseCases = {
      execute: jest.fn(),
    } as jest.Mocked<FindPaymentByIdUseCasesPort>;
    updatePaymentService = {
      execute: jest.fn(),
    } as jest.Mocked<UpdatePaymentServicePort>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        {
          provide: CreatePixPaymentUseCasesPort,
          useValue: createPaymentUseCases,
        },
        {
          provide: FindPaymentByIdUseCasesPort,
          useValue: findPaymentByIdUseCases,
        },
        { provide: UpdatePaymentServicePort, useValue: updatePaymentService },
      ],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
  });

  it('should create a payment', async () => {
    const dto: CreatePaymentDto = {
      value: 100,
      method: 'PIX',
      orderId: '1',
      client: {
        cpf: '12345678901',
        email: 'test@example.com',
        name: 'Test',
        isValid: jest.fn(),
      },
    };

    const payment: Payment = new Payment(
      '1',
      dto.value,
      dto.method,
      null,
      StatusEnum.PENDING,
      null,
      new Date(),
    );

    createPaymentUseCases.execute.mockResolvedValue(payment);

    const result = await controller.create(dto);

    expect(result).toBe(payment);
    expect(createPaymentUseCases.execute).toHaveBeenCalledWith(
      expect.any(Payment),
      dto.client,
      dto.orderId,
    );
  });

  it('should get payment status by id', async () => {
    const payment: Payment = new Payment(
      '1',
      100,
      'PIX',
      null,
      StatusEnum.PENDING,
      null,
      new Date(),
    );

    findPaymentByIdUseCases.execute.mockResolvedValue(payment);

    const result = await controller.getStatusById('1');

    expect(result).toEqual({ status: payment.status });
    expect(findPaymentByIdUseCases.execute).toHaveBeenCalledWith('1');
  });

  it('should update a payment by id', async () => {
    const updateResponse = {
      message: 'Payment register was updated successfully',
    };

    updatePaymentService.execute.mockResolvedValue(updateResponse);

    const result = await controller.updateById('1');

    expect(result).toBe(updateResponse);
    expect(updatePaymentService.execute).toHaveBeenCalledWith('1');
  });
});
