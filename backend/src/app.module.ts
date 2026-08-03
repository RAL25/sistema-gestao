import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { ClienteModule } from './modules/cliente/cliente.module';
import { ProdutoModule } from './modules/produto/produto.module';
import { VendaModule } from './modules/venda/venda.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsuarioModule,
    ClienteModule,
    ProdutoModule,
    VendaModule,
    AuthModule,
    DatabaseModule,
  ],
})
export class AppModule {}
