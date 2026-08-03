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
import { RolesGuard } from '../auth/roles.guard';
import { ProdutoService } from './produto.service';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { type FindAllParameters, ProdutoDto } from './produto.dto';
import { ProdutoEntity } from 'src/database/entities/produto.entity';

@UseGuards(AuthGuard, RolesGuard)
@Controller('produto')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Get()
  async findAll(@Query() params: FindAllParameters): Promise<ProdutoEntity[]> {
    return await this.produtoService.findAll(params);
  }

  // Apenas o Administrador pode cadastrar, atualizar ou deletar um produto
  @Roles(Role.ADMINISTRADOR)
  @Post()
  async create(@Body() produto: ProdutoDto) {
    return await this.produtoService.create(produto);
  }

  @Roles(Role.ADMINISTRADOR)
  @Put('/:id')
  async update(
    @Param('id') id: number,
    @Body() produto: ProdutoDto,
  ): Promise<ProdutoEntity> {
    return await this.produtoService.update(id, produto);
  }

  @Roles(Role.ADMINISTRADOR)
  @Delete()
  async remove(@Body() produto: ProdutoDto): Promise<ProdutoEntity> {
    return await this.produtoService.toggleActive(produto.id);
  }
}
