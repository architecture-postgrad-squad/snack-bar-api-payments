import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PaymentController } from '@/transport/controller/payment.controller';
import { IPaymentRepository } from '@/core/repository/payment/payment.repository';
import { PaymentMongoAdapter } from '@/datasource/database/adapter/payment/payment-mongo.adapter';
import { PaymentSchema } from '@/datasource/database/adapter/payment/schemas/payment.schema';
import { CreatePixPaymentUseCasesPort } from '@/core/interactor/port/payment/create-payment-use-cases.port';
import { MercadoPagoServicePort } from '@/datasource/mercado-pago/port/mercado-pago-service.port';
import { MercadoPagoAdapter } from '@/datasource/mercado-pago/adapter/mercado-pago-adapter.service';
import { CreatePaymentUseCases } from '@/core/interactor/usecases/payment/create-pix-payment.use-cases';
import { OrderServicePort } from '@/datasource/order-service/port/order-service.port';
import { OrderServiceAdapter } from '@/datasource/order-service/adapter/order-service-adapter.service';
import { UpdatePaymentUseCase } from '@/core/interactor/usecases/payment/update-payment.use-cases';
import { UpdatePaymentServicePort } from '@/core/interactor/port/payment/update-payment-service.port';
import { FindPaymentByIdUseCasesPort } from '@/core/interactor/port/payment/find-payment-by-id-use-cases.port';
import { FindPaymentByIdUseCases } from '@/core/interactor/usecases/payment/find-payment-by-id.use-cases';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Payment', schema: PaymentSchema }]),
  ],
  controllers: [PaymentController],
  providers: [
    {
      provide: CreatePixPaymentUseCasesPort,
      useFactory: (
        paymentRepository: IPaymentRepository,
        mercadoPagoAdapter: MercadoPagoServicePort,
        orderServiceAdapter: OrderServicePort,
      ) =>
        new CreatePaymentUseCases(
          paymentRepository,
          mercadoPagoAdapter,
          orderServiceAdapter,
        ),
      inject: [IPaymentRepository, MercadoPagoServicePort, OrderServicePort],
    },
    {
      provide: MercadoPagoServicePort,
      useClass: MercadoPagoAdapter,
    },
    {
      provide: IPaymentRepository,
      useClass: PaymentMongoAdapter,
    },
    {
      provide: OrderServicePort,
      useClass: OrderServiceAdapter,
    },
    {
      provide: FindPaymentByIdUseCasesPort,
      useFactory: (paymentRepository: IPaymentRepository) => {
        return new FindPaymentByIdUseCases(paymentRepository);
      },
      inject: [IPaymentRepository],
    },
    {
      provide: UpdatePaymentServicePort,
      useFactory: (
        paymentRepository: IPaymentRepository,
        mercadoPagoAdapter: MercadoPagoServicePort,
        orderServiceAdapter: OrderServicePort,
      ) =>
        new UpdatePaymentUseCase(
          paymentRepository,
          mercadoPagoAdapter,
          orderServiceAdapter,
        ),
      inject: [IPaymentRepository, MercadoPagoServicePort, OrderServicePort],
    },
  ],
})
export class PaymentModule {}
