import { IsInt, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class ItemVendaDto {
  @IsNumber()
  @IsOptional()
  id!: number;

  @IsInt()
  @IsNotEmpty()
  idVenda!: number;

  @IsInt()
  @IsNotEmpty()
  idProduto!: number;

  @IsInt()
  @Min(1, { message: 'A quantidade deve ser de pelo menos 1 item.' })
  quantidade!: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precoUnitario!: number;
}
