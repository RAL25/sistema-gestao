import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsuarioEntity } from '../../database/entities/usuario.entity';
import { FindAllParameters, UserForToken, UsuarioDto } from './usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
  ) {}

  async create(dto: UsuarioDto): Promise<UsuarioEntity> {
    const emailExiste = await this.usuarioRepository.findOne({
      where: { email: dto.email },
    });

    if (emailExiste) {
      throw new ConflictException('E-mail já cadastrado no sistema.');
    }

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(dto.senhaHash, salt);

    const usuario = this.usuarioRepository.create({
      ...dto,
      senhaHash,
    });

    return await this.usuarioRepository.save(usuario);
  }

  async findAll(): Promise<UsuarioEntity[]> {
    return await this.usuarioRepository.find({
      select: {
        // id: true,
        nome: true,
        email: true,
        cargo: true,
        ativo: true,
      },
    });
  }

  async findByEmail(email: string): Promise<UserForToken | null> {
    const userFound = await this.usuarioRepository.findOne({
      where: { email },
    });

    if (!userFound) {
      return null;
    }

    return {
      id: userFound.id,
      email: userFound.email,
      senhaHash: userFound.senhaHash,
      cargo: userFound.cargo,
    };
  }

  // async update(id: string, dto: Partial<UsuarioDto>): Promise<UsuarioEntity> {
  //   const usuario = await this.findOne(id);

  //   if (dto.senhaHash) {
  //     const salt = await bcrypt.genSalt(10);
  //     dto.senhaHash = await bcrypt.hash(dto.senhaHash, salt);
  //   }

  //   Object.assign(usuario, dto);
  //   return await this.usuarioRepository.save(usuario);
  // }

  // async toggleActive(id: string): Promise<UsuarioEntity> {
  //   const usuario = await this.findOne(id);
  //   usuario.ativo = !usuario.ativo;
  //   return await this.usuarioRepository.save(usuario);
  // }
}
