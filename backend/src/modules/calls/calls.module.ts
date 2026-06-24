import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Call } from './entities/call.entity';
import { CallsService } from './calls.service';
import { CallsController } from './calls.controller';
import { WebRTCService } from './webrtc.service';
import { CallGateway } from './gateways/call.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Call]), JwtModule.register({})],
  controllers: [CallsController],
  providers: [CallsService, WebRTCService, CallGateway],
  exports: [CallsService, WebRTCService],
})
export class CallsModule {}
