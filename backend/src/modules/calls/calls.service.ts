import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Call, CallStatus, CallType } from './entities/call.entity';
import { CallParticipant } from './entities/call-participant.entity';
import { WebRTCService } from './webrtc.service';
import { ChatMembershipService } from '@/modules/messages/chat-membership.service';
import { NotificationsService } from '@/modules/notifications/notifications.service';
import { NotificationGateway } from '@/modules/notifications/gateways/notification.gateway';
import { NotificationType } from '@/modules/notifications/entities/notification.entity';
import { User } from '@/modules/users/entities/user.entity';

@Injectable()
export class CallsService {
  constructor(
    @InjectRepository(Call) private callRepo: Repository<Call>,
    @InjectRepository(CallParticipant) private participantRepo: Repository<CallParticipant>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private webrtcService: WebRTCService,
    private membership: ChatMembershipService,
    private notifications: NotificationsService,
    private notificationGateway: NotificationGateway,
  ) {}

  async create(data: { chatId: string; initiatorId: string; type: CallType }) {
    const isMember = await this.membership.isMemberAnyType(data.chatId, data.initiatorId);
    if (!isMember) throw new ForbiddenException("Bu chatga kirish huquqingiz yo'q");

    const ongoing = await this.callRepo.findOne({
      where: { chatId: data.chatId, status: CallStatus.ONGOING },
    });
    if (ongoing) {
      await this.join(ongoing.id, data.initiatorId);
      return ongoing;
    }

    const call = this.callRepo.create(data);
    await this.callRepo.save(call);
    await this.participantRepo.save(
      this.participantRepo.create({ callId: call.id, userId: data.initiatorId }),
    );
    await this.webrtcService.createRouter(call.id);
    await this.announce(call, data.initiatorId);
    return call;
  }

  private async announce(call: Call, initiatorId: string) {
    const initiator = await this.userRepo.findOne({
      where: { id: initiatorId },
      select: ['id', 'displayName', 'username', 'avatarUrl'],
    });
    const memberIds = await this.membership.memberIdsFor(call.chatId);
    const targets = memberIds.filter((id) => id !== initiatorId);
    if (!targets.length) return;

    const payload = {
      callId: call.id,
      chatId: call.chatId,
      type: call.type,
      initiator: initiator ?? { id: initiatorId },
    };
    const title = initiator?.displayName ?? 'ConnectHub';

    await Promise.all(
      targets.map(async (userId) => {
        await this.notifications.create(
          userId,
          NotificationType.CALL,
          title,
          call.type === CallType.VIDEO ? 'Video qo\'ng\'iroq' : "Audio qo'ng'iroq",
          payload,
        );
        this.notificationGateway.notifyUser(userId, 'incomingCall', payload);
      }),
    );
  }

  async activeForChat(chatId: string, userId: string) {
    await this.membership.assertMemberAnyType(chatId, userId);
    return this.callRepo.findOne({
      where: { chatId, status: CallStatus.ONGOING },
      relations: ['initiator'],
    });
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
    const call = await this.findOne(callId);
    const isParticipant = await this.isParticipant(callId, userId);
    if (!isParticipant) {
      throw new ForbiddenException("Faqat qo'ng'iroq ishtirokchisi tugata oladi");
    }
    await this.callRepo.update(callId, { status: CallStatus.ENDED, endedAt: new Date() });
    await this.participantRepo.update({ callId, leftAt: IsNull() }, { leftAt: new Date() });
    await this.webrtcService.closeRoom(callId);

    const memberIds = await this.membership.memberIdsFor(call.chatId);
    for (const memberId of memberIds) {
      this.notificationGateway.notifyUser(memberId, 'callEnded', {
        callId,
        chatId: call.chatId,
      });
    }

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
      .orderBy('call.startedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
