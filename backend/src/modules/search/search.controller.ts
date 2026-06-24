import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Public()
  @Get()
  search(@Query('q') q: string, @Query('type') type = 'all') {
    if (type === 'all') {
      return Promise.all([
        this.searchService.search('goals', q),
        this.searchService.search('groups', q),
        this.searchService.search('messages', q),
      ]).then(([goals, groups, messages]) => ({ goals, groups, messages }));
    }
    return this.searchService.search(type, q);
  }

  @Public()
  @Get('suggestions')
  suggestions(@Query('q') q: string) {
    return this.searchService.search('goals', q, undefined, 5);
  }
}
