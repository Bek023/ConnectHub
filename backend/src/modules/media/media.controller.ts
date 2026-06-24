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
  MaxFileSizeValidator,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags, ApiBody } from '@nestjs/swagger';
import { MediaService, MediaType, MAX_SIZES } from './media.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

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
    @UploadedFile(new ParseFilePipe({ validators: [], fileIsRequired: true })) file: Express.Multer.File,
    @Body('type') type: MediaType,
  ) {
    if (!['image', 'video', 'voice', 'file'].includes(type)) {
      throw new BadRequestException('type maydoni: image, video, voice yoki file bo\'lishi kerak');
    }
    return this.mediaService.uploadFile(file.buffer, file.originalname, file.mimetype, type);
  }

  @Delete(':key(*)')
  remove(@Param('key') key: string) {
    return this.mediaService.deleteFile(key);
  }

  @Get('presigned/:key(*)')
  presigned(@Param('key') key: string, @Query('expires') expires?: number) {
    return this.mediaService.getPresignedUrl(key, expires ? Number(expires) : 3600);
  }
}
