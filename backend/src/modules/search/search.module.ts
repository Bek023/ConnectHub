import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { GroupMember } from '@/modules/groups/entities/group-member.entity';
import { ChannelSubscriber } from '@/modules/channels/entities/channel-subscriber.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GroupMember, ChannelSubscriber])],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
