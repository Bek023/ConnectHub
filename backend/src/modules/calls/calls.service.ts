import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Call, CallStatus, CallType } from './entities/call.entity';

@Injectable()
export class CallsService {
  constructor(@InjectRepository(Call) private callRepo: Repository<Call>) {}

  async create(data: { chatId: string; initiatorId: string; type: CallType }) {
    const call = this.callRepo.create(data);
    return this.callRepo.save(call);
  }

  async findOne(id: string) {
    const call = await this.callRepo.findOne({ where: { id } });
    if (!call) throw new NotFoundException("Qo'ng'iroq topilmadi");
    return call;
  }

  async join(callId: string) {
    return this.findOne(callId);
  }

  async end(callId: string, _userId: string) {
    await this.callRepo.update(callId, { status: CallStatus.ENDED, endedAt: new Date() });
    return this.findOne(callId);
  }

  async getParticipants(_callId: string) {
    // To'liq implementatsiya uchun `call_participants` jadvali kerak bo'ladi.
    return [];
  }

  async history(userId: string, page = 1, limit = 20) {
    const [items, total] = await this.callRepo.findAndCount({
      where: { initiatorId: userId },
      order: { startedAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
