import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../database/entities/user.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seedAdminUser();
  }

  private async seedAdminUser() {
    const adminUser = process.env['ADMIN_USER'] || 'testUser';
    const adminPassword = process.env['ADMIN_PASSWORD'] || 'SuperSecret!';

    const existing = await this.userRepository.findOne({
      where: { username: adminUser },
    });

    if (!existing) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await this.userRepository.save({
        username: adminUser,
        email: `${adminUser}@localhost`,
        password: hashedPassword,
      });
      console.log(`Admin user '${adminUser}' created`);
    }
  }
}
