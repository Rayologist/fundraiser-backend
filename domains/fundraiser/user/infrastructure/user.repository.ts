import { Injectable } from '@nestjs/common';
import { AbstractUserRepository } from '../domain/interfaces/user.repository';
import { UserRepository as UserRepo } from '@modules/postgres/repositories/user.repository';
import { User as UserAggregate } from '../domain/user.aggregate-root';
import { User } from '@modules/postgres/entities/user.entity';
import { Repository } from 'typeorm';
import { UserMapper } from './mappers/user.mapper';
import { InjectRepository } from '@nestjs/typeorm';

export const enum UserDomain {
  Repository = 'UserDomainRepository',
}

@Injectable()
export class UserDomainRepository implements AbstractUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly rawUserRepository: Repository<User>,
    private readonly userRepository: UserRepo,
  ) {}

  async findOneById(id: string): Promise<UserAggregate | null> {
    const user = await this.userRepository.findOneById(id);

    if (!user) {
      return null;
    }

    return UserMapper.toDomain(user);
  }

  async findOneByEmail(email: string): Promise<UserAggregate | null> {
    const user = await this.userRepository.findOneByEmail(email);

    if (!user) {
      return null;
    }

    return UserMapper.toDomain(user);
  }

  async save(data: UserAggregate): Promise<void> {
    const user = UserMapper.toPersistence(data);
    await this.rawUserRepository.save(user);
  }
}
