import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ClienteDto {
  @IsUUID()
  @IsOptional()
  id!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(255)
  nomeRazaoSocial!: string;

  @IsString()
  @MinLength(11)
  @MaxLength(14)
  cnpjCpf!: string;

  @IsString()
  @Length(8, 8)
  cep!: string;

  @IsString()
  @IsNotEmpty()
  logradouro!: string;

  @IsString()
  @IsNotEmpty()
  numero!: string;

  @IsString()
  @IsNotEmpty()
  bairro!: string;

  @IsNotEmpty()
  cidade!: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 2, { message: 'A UF deve ter exatamente 2 caracteres.' })
  @Matches(/^[A-Z]{2}$/, {
    message: 'A UF deve conter apenas 2 letras maiúsculas.',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  uf!: string;

  @IsString()
  @IsOptional()
  complemento!: string;
}

export interface FindAllParameters {
  nome: string;
}
