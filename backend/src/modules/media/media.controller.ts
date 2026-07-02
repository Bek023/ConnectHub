import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Body,
  ParseFilePipe,
  BadRequestException,
} from '@nestjs/common';
import { OptionalIntPipe } from '@/common/pipes/optional-int.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags, ApiBody } from '@nestjs/swagger';
import { MediaService, MediaType } from './media.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@ApiTags('Media')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'type'],
      properties: {
        file: { type: 'string', format: 'binary' },
        type: { type: 'string', enum: ['image', 'video', 'voice', 'file'] },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 100 * 1024 * 1024 } }))
  upload(
    @UploadedFile(new ParseFilePipe({ validators: [], fileIsRequired: true }))
    file: Express.Multer.File,
    @Body('type') type: MediaType,
    @CurrentUser() user: any,
  ) {
    if (!['image', 'video', 'voice', 'file'].includes(type)) {
      throw new BadRequestException("type maydoni: image, video, voice yoki file bo'lishi kerak");
    }
    return this.mediaService.uploadFile(
      file.buffer,
      file.originalname,
      file.mimetype,
      type,
      user.id,
    );
  }

  @Delete(':key(*)')
  remove(@Param('key') key: string, @CurrentUser() user: any) {
    return this.mediaService.deleteFile(key, user.id);
  }

  @Get('presigned/:key(*)')
  presigned(
    @Param('key') key: string,
    @CurrentUser() user: any,
    @Query('expires', new OptionalIntPipe()) expires?: number,
  ) {
    return this.mediaService.getPresignedUrl(key, user.id, expires ? Number(expires) : 3600);
  }
}
