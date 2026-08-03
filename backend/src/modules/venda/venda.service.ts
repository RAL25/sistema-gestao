import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { VendaEntity } from '../../database/entities/venda.entity';
import { ItemVendaEntity } from '../../database/entities/item_venda.entity';
import { ProdutoEntity } from '../../database/entities/produto.entity';
import { ClienteEntity } from '../../database/entities/cliente.entity';
import { UsuarioEntity } from '../../database/entities/usuario.entity';
import { VendaDto, StatusVendaEnum } from './venda.dto';
import { type ItemVendaDto } from './venda.dto';
import { ClienteService } from '../cliente/cliente.service';

@Injectable()
export class VendaService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(VendaEntity)
    private readonly vendaRepository: Repository<VendaEntity>,
  ) {}

  async createSale(
    dto: ItemVendaDto,
    vendedorIdParam?: string,
  ): Promise<VendaEntity> {
    // 1. Validar se há produtos no payload
    if (!dto.produtos || dto.produtos.length === 0) {
      throw new BadRequestException('A venda deve conter ao menos um item.');
    }

    // 2. Iniciar o QueryRunner para gerenciar a Transação SQL
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 3. Validar a existência do Cliente pelo CPF/CNPJ dentro da transação
      const cliente = await queryRunner.manager.findOne(ClienteEntity, {
        where: { cnpjCpf: dto.cnpjCpf },
      });

      if (!cliente) {
        throw new NotFoundException(
          `Cliente não encontrado para o CPF/CNPJ (${dto.cnpjCpf}) informado.`,
        );
      }

      // 4. Validar o Vendedor (usando o ID fornecido no parâmetro do método ou no DTO)
      const idVendedorFinal = vendedorIdParam;
      let vendedor: UsuarioEntity | null = null;

      if (idVendedorFinal) {
        vendedor = await queryRunner.manager.findOne(UsuarioEntity, {
          where: { id: idVendedorFinal },
        });

        if (!vendedor || !vendedor.ativo) {
          throw new BadRequestException(
            'Vendedor informado é inválido ou está inativo.',
          );
        }
      }

      let valorTotalCalculado = 0;
      const itensEntity: ItemVendaEntity[] = [];

      // 5. Processar cada produto da lista
      for (const itemDto of dto.produtos) {
        // Busca o produto pelo nome/descrição aplicando PESSIMISTIC_WRITE para evitar Race Conditions
        const produto = await queryRunner.manager.findOne(ProdutoEntity, {
          where: { nomeProduto: itemDto.descricao },
          lock: { mode: 'pessimistic_write' },
        });

        if (!produto || !produto.ativo) {
          throw new BadRequestException(
            `Produto '${itemDto.descricao}' não foi encontrado ou está inativo no sistema.`,
          );
        }

        // Valida se a quantidade em estoque é suficiente
        if (produto.quantidadeEstoque < itemDto.quantidade) {
          throw new BadRequestException(
            `Estoque insuficiente para o produto '${produto.nomeProduto}'. Disponível: ${produto.quantidadeEstoque}, Solicitado: ${itemDto.quantidade}.`,
          );
        }

        // Abater o estoque do produto
        produto.quantidadeEstoque -= itemDto.quantidade;
        await queryRunner.manager.save(produto);

        // Define o preço unitário praticado na venda (prioriza o preço oficial cadastrado no banco)
        const precoUnitario = Number(produto.precoVenda);
        const subtotal = precoUnitario * itemDto.quantidade;
        valorTotalCalculado += subtotal;

        // Instancia o item da venda
        const item = queryRunner.manager.create(ItemVendaEntity, {
          idProduto: produto.id,
          quantidade: itemDto.quantidade,
          precoUnitario: precoUnitario,
        });

        itensEntity.push(item);
      }

      // 6. Criar e salvar a Venda (os itens serão salvos automaticamente pelo 'cascade: true')
      const venda = queryRunner.manager.create(VendaEntity, {
        idCliente: cliente.id,
        idVendedor: vendedor ? vendedor.id : idVendedorFinal,
        valorTotal: valorTotalCalculado,
        statusVenda: StatusVendaEnum.CONCLUIDA,
        itens: itensEntity,
      });

      const vendaSalva = await queryRunner.manager.save(venda);

      // 7. Confirma (Commit) a transação se todas as etapas correram bem
      await queryRunner.commitTransaction();
      return vendaSalva;
    } catch (error) {
      // Em caso de qualquer falha em qualquer produto ou validação, reverte tudo (Rollback)
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Libera a conexão do QueryRunner de volta para o pool
      await queryRunner.release();
    }
  }

  async findAll(vendedorIdParam?: string): Promise<VendaEntity[]> {
    return await this.vendaRepository.find({
      where: {
        idVendedor: vendedorIdParam,
      },
      // relations: ['cliente', 'vendedor', 'itens', 'itens.produto'],
      // relations: {
      //   cliente: true,
      //   vendedor: true,
      //   itens: true,
      // },
      order: { dataVenda: 'DESC' },
    });
  }

  async findOne(id: number): Promise<VendaEntity> {
    const venda = await this.vendaRepository.findOne({
      where: { id },
      // relations: ['cliente', 'vendedor', 'itens', 'itens.produto'],
      // relations: {
      //   cliente: true,
      //   vendedor: true,
      //   itens: true,
      // },
    });

    if (!venda) {
      throw new NotFoundException(`Venda com ID ${id} não encontrada.`);
    }

    return venda;
  }

  async cancelSale(id: number): Promise<string> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const venda = await queryRunner.manager.findOne(VendaEntity, {
        where: { id },
        relations: { itens: true },
      });

      if (!venda) {
        throw new NotFoundException(`Venda com ID ${id} não encontrada.`);
      }

      if (venda.statusVenda === StatusVendaEnum.CANCELADA) {
        throw new BadRequestException('Esta venda já está cancelada.');
      }

      // Devolve a quantidade dos produtos ao estoque
      for (const item of venda.itens) {
        const produto = await queryRunner.manager.findOne(ProdutoEntity, {
          where: { id: item.idProduto },
          lock: { mode: 'pessimistic_write' },
        });

        if (produto) {
          produto.quantidadeEstoque += item.quantidade;
          await queryRunner.manager.save(produto);
        }
      }

      venda.statusVenda = StatusVendaEnum.CANCELADA;
      venda.dataCancelada = new Date();

      await queryRunner.manager.save(venda);
      await queryRunner.commitTransaction();

      return 'Venda cancelada com sucesso.';
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
