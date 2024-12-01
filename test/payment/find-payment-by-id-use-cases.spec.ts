import { StatusEnum } from '@/core/domain/payment/status.entity';
import { NotFoundException } from '@/core/exceptions/custom-exceptions/not-found.exception';
import { FindPaymentByIdUseCasesPort } from '@/core/interactor/port/payment/find-payment-by-id-use-cases.port';
import { FindPaymentByIdUseCases } from '@/core/interactor/usecases/payment/find-payment-by-id.use-cases';
import { IPaymentRepository } from '@/core/repository/payment/payment.repository';

describe('FindPaymentByIdUseCases', () => {
  const paymentRepository: IPaymentRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    updateById: jest.fn(),
  };
  const useCase: FindPaymentByIdUseCasesPort = new FindPaymentByIdUseCases(
    paymentRepository,
  );

  const paymentMock = {
    id: '1',
    value: 100,
    method: 'Credit Card',
    externalId: '123',
    status: StatusEnum.APPROVED,
    createdAt: new Date(),
  };

  it('should return payment status', async () => {
    jest.spyOn(paymentRepository, 'findById').mockResolvedValue(paymentMock);

    expect(await useCase.execute('1')).toBe(paymentMock);
    expect(paymentRepository.findById).toHaveBeenCalled();
  });

  it('should throw an error if payment is not registered in database', async () => {
    jest
      .spyOn(paymentRepository, 'findById')
      .mockRejectedValueOnce(new Error());

    try {
      return await useCase.execute('2');
    } catch (error) {
      expect(error).toEqual(
        new NotFoundException({ description: 'Payment not found' }),
      );
    }
  });
});
