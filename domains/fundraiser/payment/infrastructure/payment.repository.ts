import { InjectRepository } from '@nestjs/typeorm';
import { AbstractPaymentRepository } from '../domain/interfaces/payment.repository';
import { Payment as PaymentAggregateRoot } from '../domain/payment.aggregate-root';
import { Payment } from '@modules/postgres/entities/payment.entity';
import { Repository } from 'typeorm';
import { PaymentMapper } from './mapper/payment.mapper';
import { EventEmitter2 } from '@nestjs/event-emitter';

export const enum PaymentDomain {
  Repository = 'PaymentDomainRepository',
}

export class PaymentDomainRepository implements AbstractPaymentRepository {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findOneById(id: string): Promise<PaymentAggregateRoot | null> {
    const payment = await this.paymentRepository.findOneBy({ id });
    if (!payment) {
      return null;
    }

    return PaymentMapper.toDomain(payment);
  }

  async findOneByOrderId(input: {
    orderId: string;
  }): Promise<PaymentAggregateRoot | null> {
    const payment = await this.paymentRepository.findOneBy({
      orderId: input.orderId,
    });

    if (!payment) {
      return null;
    }

    return PaymentMapper.toDomain(payment);
  }

  async findOneByUserIdAndPaymentId(input: {
    userId: string;
    paymentId: string;
  }): Promise<PaymentAggregateRoot | null> {
    const payment = await this.paymentRepository.findOneBy({
      userId: input.userId,
      id: input.paymentId,
    });

    if (!payment) {
      return null;
    }

    return PaymentMapper.toDomain(payment);
  }

  async save(data: PaymentAggregateRoot): Promise<void> {
    const payment = PaymentMapper.toPersistence(data);
    await this.paymentRepository.save(payment);
    await Promise.all(
      data.domainEvents.map((event) =>
        this.eventEmitter.emitAsync(event.eventName, event),
      ),
    );
    data.clearEvents();
  }
}
