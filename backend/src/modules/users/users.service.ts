import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findById(id: string) {
    return this.userRepo.findOne({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  async updateMe(userId: string, dto: UpdateUserDto) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
    Object.assign(user, dto);
    return this.userRepo.save(user);
  }

  async deleteMe(userId: string) {
    await this.userRepo.update(userId, { isActive: false });
    return { message: "Akkaunt o'chirildi" };
  }

  async search(query: string, page = 1, limit = 20) {
    const [items, total] = await this.userRepo.findAndCount({
      where: [{ username: Like(`%${query}%`) }, { displayName: Like(`%${query}%`) }],
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
