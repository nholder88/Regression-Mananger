import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../database/entities/user.entity';
import { PaginationDto, PaginatedResponse, paginate } from '../common/pagination.dto';

type UserWithoutPassword = Omit<User, 'password'> & { password?: never };

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  private excludePassword(user: User): UserWithoutPassword {
    const { password: _, ...rest } = user;
    return rest as UserWithoutPassword;
  }

  async findAll(query: PaginationDto): Promise<PaginatedResponse<UserWithoutPassword>> {
    const page = query.page || 1;
    const limit = query.limit || 25;
    const [data, total] = await this.repository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.username',
        'user.email',
        'user.createdAt',
      ])
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return paginate(data as unknown as UserWithoutPassword[], total, page, limit);
  }

  async findOne(id: string): Promise<UserWithoutPassword> {
    const entity = await this.repository
      .createQueryBuilder('user')
      .select(['user.id', 'user.username', 'user.email', 'user.createdAt'])
      .where('user.id = :id', { id })
      .getOne();
    if (!entity) throw new NotFoundException();
    return entity as unknown as UserWithoutPassword;
  }

  async create(data: { username: string; email: string; password: string }): Promise<UserWithoutPassword> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const entity = this.repository.create({
      username: data.username,
      email: data.email,
      password: hashedPassword,
    });
    const saved = await this.repository.save(entity);
    return this.excludePassword(saved);
  }

  async update(
    id: string,
    data: Partial<{ username: string; email: string; password: string }>,
  ): Promise<UserWithoutPassword> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException();

    const updatePayload: Partial<User> = { ...data };
    if (data.password) {
      updatePayload.password = await bcrypt.hash(data.password, 10);
    }

    await this.repository.update(id, updatePayload);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repository.delete(id);
  }
}
