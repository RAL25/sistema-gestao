import { Module } from '@nestjs/common';
import { ClienteController } from './cliente.controller';
import { ClienteService } from './cliente.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteEntity } from 'src/database/entities/cliente.entity';

@Module({
  controllers: [ClienteController],
  exports: [ClienteService],
  imports: [TypeOrmModule.forFeature([ClienteEntity])],
  providers: [ClienteService],
})
export class ClienteModule {}
