import { PaymentModule } from '@/config/modules/payment.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot(process.env.DATABASE_URL), PaymentModule],
})
export class AppModule {}
