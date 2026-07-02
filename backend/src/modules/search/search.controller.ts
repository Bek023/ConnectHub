import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Public } from '@/common/decorators/public.decorator';
import { GroupMember } from '@/modules/groups/entities/group-member.entity';
import { ChannelSubscriber } from '@/modules/channels/entities/channel-subscriber.entity';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(
    private searchService: SearchService,
    @InjectRepository(GroupMember) private memberRepo: Repository<GroupMember>,
    @InjectRepository(ChannelSubscriber) private subRepo: Repository<ChannelSubscriber>,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async search(@Query('q') q: string, @CurrentUser() user: any, @Query('type') type = 'all') {
    if (type === 'messages' || type === 'all') {
      const chatIds = await this.userChatIds(user.id);

      if (type === 'messages') {
        return this.searchService.search('messages', q, undefined, 20, chatIds);
      }

      const [goals, groups, messages] = await Promise.all([
        this.searchService.search('goals', q),
        this.searchService.search('groups', q),
        this.searchService.search('messages', q, undefined, 20, chatIds),
      ]);
      return { goals, groups, messages };
    }
    return this.searchService.search(type, q);
  }

  @Public()
  @Get('suggestions')
  suggestions(@Query('q') q: string) {
    return this.searchService.search('goals', q, undefined, 5);
  }

  private async userChatIds(userId: string): Promise<string[]> {
    const [groups, channels] = await Promise.all([
      this.memberRepo.find({ where: { userId }, select: ['groupId'] }),
      this.subRepo.find({ where: { userId }, select: ['channelId'] }),
    ]);
    return [...groups.map((g) => g.groupId), ...channels.map((c) => c.channelId)];
  }
}
