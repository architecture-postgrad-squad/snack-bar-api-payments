import { ClientDto } from '@/transport/dto/client/client.dto';
import { Payment } from '@/core/domain/payment/payment.entity';
import { InternalServerErrorException } from '@/core/exceptions/custom-exceptions/internal-server-error.exception';
import {
  MercadoPagoPaymentDto,
  toDomain,
} from '@/datasource/mercado-pago/dto/payment.dto';
import { MercadoPagoServicePort } from '@/datasource/mercado-pago/port/mercado-pago-service.port';
import axios from 'axios';
import { env } from 'process';

export class MercadoPagoAdapter implements MercadoPagoServicePort {
  constructor() {}

  api = axios.create({
    baseURL: env.MERCADO_PAGO_API_URL,
    headers: {
      Authorization: `Bearer ${env.MERCADO_PAGO_ACCESS_TOKEN}`,
    },
  });

  async createPayment(payment: Payment, client: ClientDto): Promise<Payment> {
    this.api.defaults.headers.post['X-Idempotency-Key'] = payment.id;
    const paymentPayload = {
      payer: {
        entity_type: 'individual',
        email: client.email,
        identification: {
          type: 'CPF',
          number: client.cpf,
        },
      },
      payment_method_id: 'pix',
      transaction_amount: payment.value,
      metadata: {
        id: payment.id,
      },
    };

    const mercadoPagoPayment = await this.api
      .post('/payments', paymentPayload)
      .then((response) => response.data);

    return this.mercadoPagoPaymentToDomainPayment(mercadoPagoPayment);
  }

  async getPaymentById(id: string): Promise<Payment> {
    const payment = await this.getById(id);
    return this.mercadoPagoPaymentToDomainPayment(payment);
  }

  private mercadoPagoPaymentToDomainPayment(
    payment: MercadoPagoPaymentDto,
  ): Payment {
    return toDomain(payment);
  }

  private async getById(id: string): Promise<MercadoPagoPaymentDto> {
    try {
      return (await this.api.get(`/payments/${id}`)).data;
    } catch (error) {
      throw new InternalServerErrorException({
        description: 'Third party API is out of service',
      });
    }
  }
}
