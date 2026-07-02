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

  async findPublicById(id: string) {
    const user = await this.userRepo.findOne({
      where: { id },
      select: ['id', 'username', 'displayName', 'avatarUrl', 'bio', 'lastSeen', 'createdAt'],
    });
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
    return user;
  }

  async search(query: string, page = 1, limit = 20) {
    const escaped = query.replace(/[\\%_]/g, (m) => `\\${m}`);
    const [items, total] = await this.userRepo.findAndCount({
      where: [{ username: Like(`%${escaped}%`) }, { displayName: Like(`%${escaped}%`) }],
      select: ['id', 'username', 'displayName', 'avatarUrl', 'bio'],
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
