import axios from 'axios';
import { InternalServerErrorException } from '@/core/exceptions/custom-exceptions/internal-server-error.exception';
import { OrderDTO } from '@/datasource/order-service/dto/response/order.dto';
import { OrderServicePort } from '@/datasource/order-service/port/order-service.port';
import { env } from 'process';

export class OrderServiceAdapter implements OrderServicePort {
  constructor() {}
  private api = axios.create({
    baseURL: env.ORDER_SERVICE_API_URL,
  });

  async updateOrderStatus(orderId: string, status: string): Promise<any> {
    try {
      console.log('Order service update:', orderId, status);
      await this.api.patch(`/orders/${orderId}`, {
        status,
      });
      return { message: 'Order status updated successfully' };
    } catch (error) {
      console.error('Order service update failed:', error);
      throw new InternalServerErrorException({
        description: 'Failed to update order status',
      });
    }
  }

  async getOrderByPaymentId(paymentId: string): Promise<OrderDTO> {
    try {
      console.log('Payment id', paymentId);
      // TODO: Implement after order service is ready
      // return {
      //   id: '1',
      //   status: 'WAITING_PAYMENT',
      //   paymentId,
      //   orderCode: 1,
      //   clientId: '1',
      //   createdAt: new Date(),
      // };
      const response = await this.api.get(`/orders/payment/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('Order service retrieval failed:', error);
      throw new InternalServerErrorException({
        description: 'Failed to retrieve order details',
      });
    }
  }
}
