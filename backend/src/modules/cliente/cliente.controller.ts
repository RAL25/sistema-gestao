import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ClienteService } from './cliente.service';
import { ClienteDto, type FindAllParameters } from './cliente.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../auth/roles.enum';
import { Roles } from '../auth/roles.decorator';
import { ClienteEntity } from 'src/database/entities/cliente.entity';

@UseGuards(AuthGuard, RolesGuard)
@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post()
  async create(@Body() cliente: ClienteDto): Promise<ClienteEntity> {
    return await this.clienteService.create(cliente);
  }

  // TODO: Alterar o findAll para filtrar por nome, cnpj ou cpf
  @Get()
  async findAll(): Promise<ClienteEntity[]> {
    return await this.clienteService.findAll();
  }

  @Get('/:cnpjCpf')
  async findById(@Param('cnpjCpf') cnpjCpf: string): Promise<ClienteEntity> {
    return await this.clienteService.findOne(cnpjCpf);
  }

  // Apenas o Administrador pode atualizar ou deletar um cliente
  @Roles(Role.ADMINISTRADOR)
  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() cliente: ClienteDto,
  ): Promise<ClienteEntity> {
    return await this.clienteService.update(id, cliente);
  }

  @Roles(Role.ADMINISTRADOR)
  @Delete()
  async remove(@Body() cliente: ClienteDto): Promise<string> {
    return await this.clienteService.remove(cliente.id);
  }
}
