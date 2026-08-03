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
import {
  type FindAllParameters,
  UserForToken,
  UsuarioDto,
} from './usuario.dto';
import { UsuarioService } from './usuario.service';
import { UsuarioEntity } from 'src/database/entities/usuario.entity';
// import { AuthGuard } from '../auth/auth.guard';
// import { RolesGuard } from '../auth/roles.guard';
// import { Roles } from '../auth/roles.decorator';
// import { Role } from '../auth/roles.enum';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly userService: UsuarioService) {}

  @Post()
  async create(@Body() usuario: UsuarioDto) {
    return await this.userService.create(usuario);
  }

  // @UseGuards(AuthGuard, RolesGuard)
  @Get()
  async findAll(@Query() params: FindAllParameters): Promise<UsuarioEntity[]> {
    return await this.userService.findAll();
  }

  // @Get('teste')
  // async teste(@Query() param: FindAllParameters): Promise<UserForToken | null> {
  //   return await this.userService.findByEmail(param.email);
  // }

  // @Roles(Role.ADMINISTRADOR)
  // @Put('/:id')
  // update(@Body() usuario: UsuarioDto, @Param('id') id: string) {
  //   this.userService.update(usuario, id);
  // }

  // // @Roles(Role.ADMINISTRADOR)
  // @Delete('/:id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(id);
  // }
}
