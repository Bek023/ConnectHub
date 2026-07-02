import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';
import { ChannelSubscriber } from './entities/channel-subscriber.entity';
import { CreateChannelDto } from './dto/create-channel.dto';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel) private channelRepo: Repository<Channel>,
    @InjectRepository(ChannelSubscriber) private subRepo: Repository<ChannelSubscriber>,
  ) {}

  async findAll(goalId?: string, page = 1, limit = 20) {
    const where = goalId ? { goalId } : {};
    const [items, total] = await this.channelRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const channel = await this.channelRepo.findOne({ where: { id } });
    if (!channel) throw new NotFoundException('Kanal topilmadi');
    return channel;
  }

  async create(dto: CreateChannelDto, userId: string) {
    const channel = this.channelRepo.create({ ...dto, createdById: userId });
    return this.channelRepo.save(channel);
  }

  async update(id: string, dto: Partial<CreateChannelDto>, actorId: string) {
    const channel = await this.findOne(id);
    this.assertOwner(channel, actorId);
    await this.channelRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string, actorId: string) {
    const channel = await this.findOne(id);
    this.assertOwner(channel, actorId);
    await this.channelRepo.delete(id);
    return { message: "Kanal o'chirildi" };
  }

  private assertOwner(channel: Channel, userId: string) {
    if (channel.createdById !== userId) {
      throw new ForbiddenException('Faqat kanal egasi bu amalni bajara oladi');
    }
  }

  async subscribe(channelId: string, userId: string) {
    await this.findOne(channelId);
    const exists = await this.subRepo.findOne({ where: { channelId, userId } });
    if (exists) throw new ConflictException("Allaqachon obuna bo'lgan");
    const sub = this.subRepo.create({ channelId, userId });
    await this.subRepo.save(sub);
    await this.channelRepo.increment({ id: channelId }, 'subscriberCount', 1);
    return sub;
  }

  async unsubscribe(channelId: string, userId: string) {
    const result = await this.subRepo.delete({ channelId, userId });
    if (result.affected) {
      await this.channelRepo.decrement({ id: channelId }, 'subscriberCount', 1);
    }
    return { message: 'Obunadan chiqdingiz' };
  }

  async getSubscribers(channelId: string, page = 1, limit = 20) {
    const [items, total] = await this.subRepo.findAndCount({
      where: { channelId },
      relations: ['user'],
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async stats(channelId: string) {
    const channel = await this.findOne(channelId);
    return { subscriberCount: channel.subscriberCount };
  }
}
