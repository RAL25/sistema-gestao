import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class ProdutoDto {
  @IsInt()
  @IsOptional()
  id: number = 0;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nomeProduto!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precoCusto!: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precoVenda!: number;

  @IsInt()
  @Min(0)
  quantidadeEstoque!: number;

  @IsBoolean()
  ativo!: boolean;
}

export interface FindAllParameters {
  nomeProduto: string;
  ativo: boolean;
}
