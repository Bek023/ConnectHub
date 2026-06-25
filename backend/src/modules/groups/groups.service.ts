import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Group } from './entities/group.entity';
import { GroupMember, MemberRole } from './entities/group-member.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { SearchService } from '@/modules/search/search.service';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group) private groupRepo: Repository<Group>,
    @InjectRepository(GroupMember) private memberRepo: Repository<GroupMember>,
    private dataSource: DataSource,
    private searchService: SearchService,
  ) {}

  async findAll(goalId?: string, page = 1, limit = 20) {
    const where = goalId ? { goalId } : {};
    const [items, total] = await this.groupRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const group = await this.groupRepo.findOne({ where: { id } });
    if (!group) throw new NotFoundException('Guruh topilmadi');
    return group;
  }

  async create(dto: CreateGroupDto, userId: string) {
    const group = await this.dataSource.transaction(async (manager) => {
      const g = manager.create(Group, {
        ...dto,
        createdById: userId,
        inviteCode: uuid().slice(0, 8),
        memberCount: 1,
      });
      await manager.save(g);

      const member = manager.create(GroupMember, {
        groupId: g.id,
        userId,
        role: MemberRole.ADMIN,
      });
      await manager.save(member);

      return g;
    });

    await this.searchService.indexDocument('groups', group.id, {
      name: group.name,
      description: group.description,
      goalId: group.goalId,
      memberCount: group.memberCount,
    });

    return group;
  }

  async update(id: string, dto: Partial<CreateGroupDto>) {
    await this.findOne(id);
    await this.groupRepo.update(id, dto);
    const updated = await this.findOne(id);
    await this.searchService.indexDocument('groups', id, {
      name: updated.name,
      description: updated.description,
      goalId: updated.goalId,
      memberCount: updated.memberCount,
    });
    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.groupRepo.delete(id);
    await this.searchService.deleteDocument('groups', id);
    return { message: "Guruh o'chirildi" };
  }

  async join(groupId: string, userId: string) {
    const group = await this.findOne(groupId);
    const exists = await this.memberRepo.findOne({ where: { groupId, userId } });
    if (exists) throw new ConflictException("Allaqachon a'zo");
    if (group.memberCount >= group.maxMembers) {
      throw new ConflictException("Guruh to'lgan");
    }

    return this.dataSource.transaction(async (manager) => {
      const member = manager.create(GroupMember, { groupId, userId, role: MemberRole.MEMBER });
      await manager.save(member);
      await manager.increment(Group, { id: groupId }, 'memberCount', 1);
      return member;
    });
  }

  async joinByCode(code: string, userId: string) {
    const group = await this.groupRepo.findOne({ where: { inviteCode: code } });
    if (!group) throw new NotFoundException('Invite kod yaroqsiz');
    return this.join(group.id, userId);
  }

  async leave(groupId: string, userId: string) {
    return this.dataSource.transaction(async (manager) => {
      const result = await manager.delete(GroupMember, { groupId, userId });
      if (result.affected) {
        await manager.decrement(Group, { id: groupId }, 'memberCount', 1);
      }
      return { message: 'Guruhdan chiqdingiz' };
    });
  }

  async getMembers(groupId: string, page = 1, limit = 20) {
    const [items, total] = await this.memberRepo.findAndCount({
      where: { groupId },
      relations: ['user'],
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateMemberRole(groupId: string, targetUserId: string, role: MemberRole, actorId: string) {
    const actor = await this.memberRepo.findOne({ where: { groupId, userId: actorId } });
    if (actor?.role !== MemberRole.ADMIN) {
      throw new ForbiddenException("Faqat admin rol o'zgartira oladi");
    }
    await this.memberRepo.update({ groupId, userId: targetUserId }, { role });
    return this.memberRepo.findOne({ where: { groupId, userId: targetUserId } });
  }

  async removeMember(groupId: string, targetUserId: string) {
    return this.leave(groupId, targetUserId);
  }
}
