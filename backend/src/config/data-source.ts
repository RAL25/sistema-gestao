import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { ClienteEntity } from 'src/database/entities/cliente.entity';
import { ItemVendaEntity } from 'src/database/entities/item_venda.entity';
import { ProdutoEntity } from 'src/database/entities/produto.entity';
import { UsuarioEntity } from 'src/database/entities/usuario.entity';
import { VendaEntity } from 'src/database/entities/venda.entity';
import { DataSourceOptions, DataSource } from 'typeorm';

config();

const configService = new ConfigService();

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: +configService.get<number>('DB_PORT')!,
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  entities: [
    // UsuarioEntity,
    // ProdutoEntity,
    // ClienteEntity,
    // VendaEntity,
    // ItemVendaEntity,
  ],
  migrations: [
    /*'dist/database/migrations/*.js',*/ 'src/database/migrations/*.ts',
  ],
  synchronize: false,
};

export default new DataSource(dataSourceOptions);
