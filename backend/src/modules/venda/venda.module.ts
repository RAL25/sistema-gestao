import { Module } from '@nestjs/common';
import { VendaController } from './venda.controller';
import { VendaService } from './venda.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendaEntity } from 'src/database/entities/venda.entity';
import { ItemVendaEntity } from 'src/database/entities/item_venda.entity';
import { UsuarioModule } from '../usuario/usuario.module';
import { ProdutoModule } from '../produto/produto.module';
import { ClienteModule } from '../cliente/cliente.module';

@Module({
  controllers: [VendaController],
  imports: [
    TypeOrmModule.forFeature([VendaEntity, ItemVendaEntity]),
    ClienteModule,
    ProdutoModule,
    UsuarioModule,
  ],
  providers: [VendaService],
})
export class VendaModule {}
