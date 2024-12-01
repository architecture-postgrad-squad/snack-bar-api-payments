import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment } from '@/core/domain/payment/payment.entity';
import { IPaymentRepository } from '@/core/repository/payment/payment.repository';

@Injectable()
export class PaymentMongoAdapter implements IPaymentRepository {
  constructor(
    @InjectModel('Payment') private readonly paymentModel: Model<Payment>,
  ) {}

  async create(payment: Payment): Promise<Payment> {
    const createdPayment = new this.paymentModel(payment);
    return createdPayment.save();
  }

  async findById(id: string): Promise<Payment> {
    return this.paymentModel.findById(id).exec();
  }

  async updateById(id: string, payment: Payment): Promise<Payment> {
    return this.paymentModel
      .findByIdAndUpdate(id, payment, { new: true })
      .exec();
  }
}
