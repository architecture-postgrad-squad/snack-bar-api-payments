import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { PaymentMongoAdapter } from '@/datasource/database/adapter/payment/payment-mongo.adapter';
import { Payment } from '@/core/domain/payment/payment.entity';

describe('PaymentMongoAdapter', () => {
  let adapter: PaymentMongoAdapter;
  let mockModel: any;

  beforeEach(async () => {
    // Mock the Mongoose model
    mockModel = jest.fn().mockImplementation(() => ({
      save: jest.fn().mockResolvedValueOnce(mockCreatedPayment),
    }));

    const mockCreatedPayment: Payment = {
      id: '1',
      value: 100,
      method: 'PIX',
      externalId: null,
      status: 'PENDING' as any,
      pixQrCode: null,
      createdAt: new Date(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentMongoAdapter,
        { provide: getModelToken('Payment'), useValue: mockModel },
      ],
    }).compile();

    adapter = module.get<PaymentMongoAdapter>(PaymentMongoAdapter);
  });

  it('should create a payment', async () => {
    const payment: Payment = {
      id: '1',
      value: 100,
      method: 'PIX',
      externalId: null,
      status: 'PENDING' as any,
      pixQrCode: null,
      createdAt: new Date(),
    };

    const result = await adapter.create(payment);

    expect(mockModel).toHaveBeenCalledWith(payment);
    expect(result).toEqual({
      id: '1',
      value: 100,
      method: 'PIX',
      externalId: null,
      status: 'PENDING' as any,
      pixQrCode: null,
      createdAt: expect.any(Date),
    });
  });

  it('should find a payment by id', async () => {
    const payment: Payment = {
      id: '1',
      value: 100,
      method: 'PIX',
      externalId: null,
      status: 'PENDING' as any,
      pixQrCode: null,
      createdAt: new Date(),
    };

    mockModel.findById = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(payment),
    });

    const result = await adapter.findById('1');

    expect(mockModel.findById).toHaveBeenCalledWith('1');
    expect(result).toEqual(payment);
  });

  it('should update a payment by id', async () => {
    const payment: Payment = {
      id: '1',
      value: 150,
      method: 'PIX',
      externalId: null,
      status: 'PENDING' as any,
      pixQrCode: null,
      createdAt: new Date(),
    };

    mockModel.findByIdAndUpdate = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(payment),
    });

    const result = await adapter.updateById('1', payment);

    expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith('1', payment, {
      new: true,
    });
    expect(result).toEqual(payment);
  });
});
