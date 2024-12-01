import { OrderDTO } from '@/datasource/order-service/dto/response/order.dto';

export abstract class OrderServicePort {
  abstract updateOrderStatus(orderId: string, status: string): Promise<void>;
  abstract getOrderByPaymentId(paymentId: string): Promise<OrderDTO>;
}
