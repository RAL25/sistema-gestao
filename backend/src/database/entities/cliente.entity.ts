import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { VendaEntity } from './venda.entity';

@Entity('clientes')
export class ClienteEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'nome_razao_social', type: 'varchar', length: 255 })
  nomeRazaoSocial!: string;

  @Column({ name: 'cnpj_cpf', type: 'varchar', length: 14 })
  cnpjCpf!: string;

  @Column({ type: 'varchar', length: 8 })
  cep!: string;

  @Column({ type: 'varchar' })
  logradouro!: string;

  @Column({ type: 'varchar' })
  numero!: string;

  @Column({ type: 'varchar' })
  bairro!: string;

  @Column({ type: 'varchar' })
  cidade!: string;

  @Column({ type: 'varchar', length: 2 })
  uf!: string;

  @Column({ type: 'varchar', nullable: true })
  complemento?: string;

  @OneToMany(() => VendaEntity, (venda) => venda.cliente)
  vendas!: VendaEntity[];
}
