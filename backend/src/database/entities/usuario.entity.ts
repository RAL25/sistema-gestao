import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CargoEnum } from '../../modules/usuario/usuario.dto';
import { VendaEntity } from './venda.entity';
import { IsOptional } from 'class-validator';

@Entity('usuarios')
export class UsuarioEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  nome!: string;

  @Column({ type: 'varchar', length: 254, unique: true })
  email!: string;

  @Column({ name: 'senha_hash', type: 'varchar', length: 255 })
  senhaHash!: string;

  @Column({
    type: 'enum',
    enum: CargoEnum,
  })
  cargo!: CargoEnum;

  @Column({ type: 'boolean', default: true })
  ativo: boolean = true;

  // @IsOptional()
  @OneToMany(() => VendaEntity, (venda) => venda.vendedor)
  vendas!: VendaEntity[];
}
