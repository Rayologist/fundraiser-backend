import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string) {
    return this._userRepository.findOne({ where: { email } });
  }

  findOneById(id?: string) {
    if (!id) {
      return null;
    }
    return this._userRepository.findOne({ where: { id } });
  }

  refreshUserToken(args: { id: string; refreshToken: string }) {
    const { id, refreshToken } = args;
    return this._userRepository.update({ id }, { refreshToken });
  }

  async create(user: User) {
    return this._userRepository.save(user);
  }
}
