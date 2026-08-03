import { Module } from '@nestjs/common';
import { ProdutoController } from './produto.controller';
import { ProdutoService } from './produto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutoEntity } from 'src/database/entities/produto.entity';

@Module({
  controllers: [ProdutoController],
  exports: [ProdutoService],
  imports: [TypeOrmModule.forFeature([ProdutoEntity])],
  providers: [ProdutoService],
})
export class ProdutoModule {}
