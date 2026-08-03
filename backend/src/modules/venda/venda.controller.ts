import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { VendaService } from './venda.service';
import { VendaEntity } from 'src/database/entities/venda.entity';
import { type ItemVendaDto } from './venda.dto';

@UseGuards(AuthGuard, RolesGuard)
@Controller('venda')
export class VendaController {
  constructor(private readonly vendaService: VendaService) {}

  @Post()
  async createSale(
    @Body() itensDto: ItemVendaDto,
    @Req() request: any,
  ): Promise<VendaEntity> {
    const idUusarioLogado = request.user.sub;
    return await this.vendaService.createSale(itensDto, idUusarioLogado);
  }

  @Get()
  async findAllSales(@Req() request: any): Promise<VendaEntity[]> {
    const idUsuarioLogado = request.user.sub;
    return await this.vendaService.findAll(idUsuarioLogado);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<VendaEntity> {
    return await this.vendaService.findOne(id);
  }

  @Put(':id')
  async cancelSale(@Param('id') id: number): Promise<string> {
    return await this.vendaService.cancelSale(id);
  }
}
