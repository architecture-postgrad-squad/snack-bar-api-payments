import { StatusEnum } from './status.entity';

export class Payment {
  readonly id: string;
  readonly value: number;
  readonly method: string;
  readonly externalId: string;
  readonly status: StatusEnum;
  readonly pixQrCode?: string;
  readonly createdAt: Date;

  constructor(
    id: string,
    value: number,
    method: string,
    externalId: string,
    status = StatusEnum.PENDING,
    pixQrCode?: string,
    createdAt?: Date,
  ) {
    this.id = id;
    this.value = value;
    this.method = method;
    this.status = status;
    this.externalId = externalId;
    this.pixQrCode = pixQrCode;
    this.createdAt = createdAt;
  }
}
