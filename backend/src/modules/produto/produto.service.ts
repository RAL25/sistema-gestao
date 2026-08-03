import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { ProdutoEntity } from '../../database/entities/produto.entity';
import { FindAllParameters, ProdutoDto } from './produto.dto';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(ProdutoEntity)
    private readonly produtoRepository: Repository<ProdutoEntity>,
  ) {}

  async create(dto: ProdutoDto): Promise<ProdutoEntity> {
    const produto = this.produtoRepository.create(dto);
    return await this.produtoRepository.save(produto);
  }

  async findAll(params: FindAllParameters): Promise<ProdutoEntity[]> {
    const searchParams: FindOptionsWhere<ProdutoEntity> = {};

    if (searchParams.nomeProduto) {
      searchParams.nomeProduto = Like(`%${params.nomeProduto}%`);
    }

    // if (searchParams.ativo) {
    //   searchParams.ativo = Like(`%${params.ativo}%`);
    // }
    // return await this.produtoRepository.find({
    //   where: searchParams,
    // });

    const produtoFound = await this.produtoRepository.find({
      where: searchParams,
    });

    return produtoFound;
  }

  async findOne(id: number): Promise<ProdutoEntity> {
    const produto = await this.produtoRepository.findOne({ where: { id } });

    if (!produto) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }

    return produto;
  }

  async update(id: number, dto: Partial<ProdutoDto>): Promise<ProdutoEntity> {
    const produto = await this.findOne(id);
    Object.assign(produto, dto);
    return await this.produtoRepository.save(produto);
  }

  async toggleActive(id: number): Promise<ProdutoEntity> {
    const produto = await this.findOne(id);
    produto.ativo = !produto.ativo;
    return await this.produtoRepository.save(produto);
  }
}
