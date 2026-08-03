import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export enum CargoEnum {
  ADMINISTRADOR = 'Administrador',
  VENDEDOR = 'Vendedor',
}

export class UsuarioDto {
  @IsUUID()
  @IsOptional()
  id!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(255)
  nome!: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email!: string; // é único também

  @IsString()
  // @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  senhaHash!: string;

  @IsEnum(CargoEnum)
  cargo!: CargoEnum;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value ?? true) // Garante o valor padrão na validação
  ativo: boolean = true;
}

export interface FindAllParameters {
  email: string;
}

export interface UserForToken {
  id: string;
  email: string;
  senhaHash: string;
  cargo: CargoEnum;
}
