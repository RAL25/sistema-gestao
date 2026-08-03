import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ItemVendaEntity } from './item_venda.entity';

@Entity('produtos')
export class ProdutoEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ name: 'nome', type: 'varchar', length: 255 })
  nomeProduto!: string;

  @Column({ name: 'preco_custo', type: 'decimal', precision: 10, scale: 2 })
  precoCusto!: number;

  @Column({ name: 'preco_venda', type: 'decimal', precision: 10, scale: 2 })
  precoVenda!: number;

  @Column({ name: 'quantidade_estoque', type: 'int' })
  quantidadeEstoque!: number;

  @Column({ type: 'boolean', default: true })
  ativo: boolean = true;

  @OneToMany(() => ItemVendaEntity, (item) => item.produto)
  itensVenda!: ItemVendaEntity[];
}
