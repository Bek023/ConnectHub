import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post as HttpPost,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@ApiTags('Posts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get('feed')
  feed(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.postsService.feed(page, limit, user.id);
  }

  @HttpPost()
  create(@Body() dto: CreatePostDto, @CurrentUser() user: any) {
    return this.postsService.create(dto, user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: { content: string },
    @CurrentUser() user: any,
  ) {
    return this.postsService.update(id, body.content, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.postsService.remove(id, user.id);
  }

  @HttpPost(':id/like')
  like(@Param('id') id: string, @CurrentUser() user: any) {
    return this.postsService.like(id, user.id);
  }

  @Delete(':id/like')
  unlike(@Param('id') id: string, @CurrentUser() user: any) {
    return this.postsService.unlike(id, user.id);
  }

  @Get(':id/liked')
  isLiked(@Param('id') id: string, @CurrentUser() user: any) {
    return this.postsService.isLiked(id, user.id);
  }

  @Get(':id/comments')
  getComments(
    @Param('id') id: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: number,
  ) {
    return this.postsService.getComments(id, cursor, limit);
  }

  @HttpPost(':id/comments')
  addComment(
    @Param('id') id: string,
    @Body() body: { content: string; replyTo?: string },
    @CurrentUser() user: any,
  ) {
    return this.postsService.addComment(id, user.id, body.content, body.replyTo);
  }

  @Delete(':id/comments/:commentId')
  removeComment(
    @Param('id') id: string,
    @Param('commentId') commentId: string,
    @CurrentUser() user: any,
  ) {
    return this.postsService.removeComment(id, commentId, user.id);
  }

  @HttpPost(':id/pin')
  pin(@Param('id') id: string, @CurrentUser() user: any) {
    return this.postsService.pin(id, user.id);
  }

  @Delete(':id/pin')
  unpin(@Param('id') id: string, @CurrentUser() user: any) {
    return this.postsService.unpin(id, user.id);
  }
}
