import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { StatusVendaEnum } from '../../modules/venda/venda.dto';
import { ClienteEntity } from './cliente.entity';
import { UsuarioEntity } from './usuario.entity';
import { ItemVendaEntity } from './item_venda.entity';

@Entity('vendas')
export class VendaEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ name: 'cliente_id', type: 'uuid' })
  idCliente!: string;

  @Column({ name: 'vendedor_id', type: 'uuid' })
  idVendedor!: string;

  @CreateDateColumn({ name: 'data_venda', type: 'timestamp' })
  dataVenda!: Date;

  @Column({ name: 'valor_total', type: 'decimal', precision: 10, scale: 2 })
  valorTotal!: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: StatusVendaEnum,
    default: StatusVendaEnum.CONCLUIDA,
  })
  statusVenda!: StatusVendaEnum;

  @Column({ name: 'cancelada_em', type: 'date', nullable: true })
  dataCancelada?: Date;

  @ManyToOne(() => ClienteEntity, (cliente) => cliente.vendas, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'cliente_id' })
  cliente!: ClienteEntity;

  @ManyToOne(() => UsuarioEntity, (usuario) => usuario.vendas, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'vendedor_id' })
  vendedor!: UsuarioEntity;

  @OneToMany(() => ItemVendaEntity, (item) => item.venda, { cascade: true })
  itens!: ItemVendaEntity[];
}
