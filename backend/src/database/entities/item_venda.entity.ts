import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { VendaEntity } from './venda.entity';
import { ProdutoEntity } from './produto.entity';

@Entity('itens_venda')
export class ItemVendaEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ name: 'venda_id', type: 'int' })
  idVenda!: number;

  @Column({ name: 'produto_id', type: 'int' })
  idProduto!: number;

  @Column({ type: 'int' })
  quantidade!: number;

  @Column({ name: 'preco_unitario', type: 'decimal', precision: 10, scale: 2 })
  precoUnitario!: number;

  @ManyToOne(() => VendaEntity, (venda) => venda.itens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'venda_id' })
  venda!: VendaEntity;

  @ManyToOne(() => ProdutoEntity, (produto) => produto.itensVenda, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'produto_id' })
  produto!: ProdutoEntity;
}
