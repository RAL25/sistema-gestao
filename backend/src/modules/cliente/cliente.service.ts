import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClienteEntity } from '../../database/entities/cliente.entity';
import { ClienteDto } from './cliente.dto';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(ClienteEntity)
    private readonly clienteRepository: Repository<ClienteEntity>,
  ) {}

  async create(dto: ClienteDto): Promise<ClienteEntity> {
    const clienteExiste = await this.clienteRepository.findOne({
      where: { cnpjCpf: dto.cnpjCpf },
    });

    if (clienteExiste) {
      throw new ConflictException('CPF/CNPJ já cadastrado.');
    }

    const cliente = this.clienteRepository.create(dto);
    return await this.clienteRepository.save(cliente);
  }

  async findAll(): Promise<ClienteEntity[]> {
    return await this.clienteRepository.find();
  }

  async findOne(cnpjCpf: string): Promise<ClienteEntity> {
    const cliente = await this.clienteRepository.findOne({
      where: { cnpjCpf },
    });

    if (!cliente) {
      throw new NotFoundException(
        `Cliente com CPF/CNPJ ${cnpjCpf} não encontrado.`,
      );
    }

    return cliente;
  }

  async update(id: string, dto: Partial<ClienteDto>): Promise<ClienteEntity> {
    const cliente = await this.findOne(id);
    Object.assign(cliente, dto);
    return await this.clienteRepository.save(cliente);
  }

  async remove(id: string): Promise<string> {
    const cliente = await this.findOne(id);
    await this.clienteRepository.remove(cliente);
    return `Cliente com id ${id} removido com sucesso.`;
  }
}
