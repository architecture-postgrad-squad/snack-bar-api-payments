import axios from 'axios';
import { MercadoPagoAdapter } from '@/datasource/mercado-pago/adapter/mercado-pago-adapter.service';
import { InternalServerErrorException } from '@/core/exceptions/custom-exceptions/internal-server-error.exception';
import { ClientDto } from '@/transport/dto/client/client.dto';
import { Payment } from '@/core/domain/payment/payment.entity';
import { MercadoPagoPaymentDto } from '@/datasource/mercado-pago/dto/payment.dto';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('MercadoPagoAdapter', () => {
  let adapter: MercadoPagoAdapter;
  let axiosInstance: jest.Mocked<typeof axios>;

  beforeEach(() => {
    axiosInstance = {
      post: jest.fn(),
      get: jest.fn(),
      defaults: { headers: { post: {} } },
    } as any;

    mockedAxios.create.mockReturnValue(axiosInstance);
    adapter = new MercadoPagoAdapter();
  });

  describe('createPayment', () => {
    it('should successfully create a payment', async () => {
      const client: ClientDto = {
        cpf: '12345678901',
        email: 'test@example.com',
        isValid: jest.fn(),
      };
      const payment: Payment = {
        id: '1',
        value: 100,
        method: 'PIX',
        status: 'PENDING' as any,
        createdAt: new Date(),
        externalId: '1',
      };

      const mercadoPagoResponse: MercadoPagoPaymentDto = {
        id: 'mercado_pago_id',
        transaction_amount: 100,
        status: 'approved',
        metadata: { id: '1' },
        payer: { email: client.email },
        point_of_interaction: { transaction_data: { qr_code: 'fake-qr-code' } },
      } as MercadoPagoPaymentDto;

      axiosInstance.post.mockResolvedValueOnce({ data: mercadoPagoResponse });

      const result = await adapter.createPayment(payment, client);

      expect(result).toMatchObject({
        id: '1',
        value: 100,
        method: 'PIX',
        status: 'Aprovado',
      });
      expect(axiosInstance.post).toHaveBeenCalledWith('/payments', {
        payer: {
          entity_type: 'individual',
          email: client.email,
          identification: { type: 'CPF', number: client.cpf },
        },
        payment_method_id: 'pix',
        transaction_amount: payment.value,
        metadata: { id: payment.id },
      });
    });

    it('should throw an error if MercadoPago API fails', async () => {
      const client: ClientDto = {
        cpf: '12345678901',
        email: 'test@example.com',
        isValid: jest.fn(),
      };
      const payment: Payment = {
        id: '1',
        value: 100,
        method: 'PIX',
        status: 'PENDING' as any,
        createdAt: new Date(),
        externalId: '1',
      };

      axiosInstance.post.mockRejectedValueOnce(new Error('API Error'));

      await expect(adapter.createPayment(payment, client)).rejects.toThrow(
        Error,
      );
    });
  });

  describe('getPaymentById', () => {
    it('should successfully fetch payment by ID', async () => {
      const mercadoPagoResponse: MercadoPagoPaymentDto = {
        id: 'mercado_pago_id',
        transaction_amount: 100,
        status: 'approved',
        metadata: { id: '1' },
        payer: { email: 'test@example.com' },
        point_of_interaction: { transaction_data: { qr_code: 'fake-qr-code' } },
      } as MercadoPagoPaymentDto;

      axiosInstance.get.mockResolvedValueOnce({ data: mercadoPagoResponse });

      const result = await adapter.getPaymentById('1');

      expect(result).toMatchObject({
        id: '1',
        value: 100,
        method: 'PIX',
        status: 'Aprovado',
      });
      expect(axiosInstance.get).toHaveBeenCalledWith('/payments/1');
    });

    it('should throw an error if the API call fails', async () => {
      axiosInstance.get.mockRejectedValueOnce(new Error('API Error'));

      await expect(adapter.getPaymentById('1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
