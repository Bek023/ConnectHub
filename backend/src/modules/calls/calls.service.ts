import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Call, CallStatus, CallType } from './entities/call.entity';
import { CallParticipant } from './entities/call-participant.entity';
import { WebRTCService } from './webrtc.service';

@Injectable()
export class CallsService {
  constructor(
    @InjectRepository(Call) private callRepo: Repository<Call>,
    @InjectRepository(CallParticipant) private participantRepo: Repository<CallParticipant>,
    private webrtcService: WebRTCService,
  ) {}

  async create(data: { chatId: string; initiatorId: string; type: CallType }) {
    const call = this.callRepo.create(data);
    await this.callRepo.save(call);
    await this.participantRepo.save(
      this.participantRepo.create({ callId: call.id, userId: data.initiatorId }),
    );
    await this.webrtcService.createRouter(call.id);
    return call;
  }

  async findOne(id: string) {
    const call = await this.callRepo.findOne({ where: { id } });
    if (!call) throw new NotFoundException("Qo'ng'iroq topilmadi");
    return call;
  }

  async join(callId: string, userId: string) {
    const call = await this.findOne(callId);
    const exists = await this.participantRepo.findOne({ where: { callId, userId } });
    if (!exists) {
      await this.participantRepo.save(this.participantRepo.create({ callId, userId }));
    }
    return call;
  }

  async leave(callId: string, userId: string) {
    await this.participantRepo.update({ callId, userId }, { leftAt: new Date() });
    return { message: "Qo'ng'iroqdan chiqdingiz" };
  }

  async end(callId: string, userId: string) {
    await this.findOne(callId);
    const isParticipant = await this.isParticipant(callId, userId);
    if (!isParticipant) {
      throw new ForbiddenException("Faqat qo'ng'iroq ishtirokchisi tugata oladi");
    }
    await this.callRepo.update(callId, { status: CallStatus.ENDED, endedAt: new Date() });
    await this.participantRepo.update({ callId, leftAt: IsNull() }, { leftAt: new Date() });
    await this.webrtcService.closeRoom(callId);
    return this.findOne(callId);
  }

  async isParticipant(callId: string, userId: string) {
    const participant = await this.participantRepo.findOne({ where: { callId, userId } });
    return !!participant;
  }

  async getParticipants(callId: string) {
    return this.participantRepo.find({
      where: { callId },
      relations: ['user'],
      select: {
        id: true,
        joinedAt: true,
        leftAt: true,
        user: { id: true, username: true, displayName: true, avatarUrl: true },
      },
    });
  }

  async history(userId: string, page = 1, limit = 20) {
    const [items, total] = await this.callRepo
      .createQueryBuilder('call')
      .innerJoin(CallParticipant, 'p', 'p.call_id = call.id AND p.user_id = :userId', { userId })
      .orderBy('call.started_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
