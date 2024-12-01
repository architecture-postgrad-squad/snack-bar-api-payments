import axios from 'axios';
import { OrderServiceAdapter } from '@/datasource/order-service/adapter/order-service-adapter.service';
import { InternalServerErrorException } from '@/core/exceptions/custom-exceptions/internal-server-error.exception';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('OrderServiceAdapter', () => {
  let service: OrderServiceAdapter;

  beforeEach(() => {
    mockedAxios.create.mockReturnValue({
      patch: jest.fn(),
      get: jest.fn(),
    } as any);
    service = new OrderServiceAdapter();
  });

  describe('updateOrderStatus', () => {
    it('should call the API to update order status', async () => {
      const apiMock = mockedAxios.create() as jest.Mocked<any>;
      apiMock.patch.mockResolvedValueOnce({ data: null });

      const orderId = '123';
      const status = 'RECEIVED';

      const result = await service.updateOrderStatus(orderId, status);

      expect(apiMock.patch).toHaveBeenCalledWith(`/orders/${orderId}`, {
        status,
      });
      expect(result).toEqual({ message: 'Order status updated successfully' });
    });

    it('should throw an InternalServerErrorException if the API call fails', async () => {
      const apiMock = mockedAxios.create() as jest.Mocked<any>;
      apiMock.patch.mockRejectedValueOnce(new Error('API Error'));

      await expect(
        service.updateOrderStatus('123', 'RECEIVED'),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getOrderByPaymentId', () => {
    it('should call the API to get an order by payment ID', async () => {
      const apiMock = mockedAxios.create() as jest.Mocked<any>;
      const mockOrder = {
        id: '1',
        status: 'WAITING_PAYMENT',
        paymentId: '456',
        orderCode: 1,
        clientId: '1',
        createdAt: new Date(),
      };
      apiMock.get.mockResolvedValueOnce({ data: mockOrder });

      const result = await service.getOrderByPaymentId('456');

      expect(apiMock.get).toHaveBeenCalledWith(`/orders/payment/456`);
      expect(result).toEqual(mockOrder);
    });

    it('should throw an InternalServerErrorException if the API call fails', async () => {
      const apiMock = mockedAxios.create() as jest.Mocked<any>;
      apiMock.get.mockRejectedValueOnce(new Error('API Error'));

      await expect(service.getOrderByPaymentId('456')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
