import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';

export enum StatusVendaEnum {
  CONCLUIDA = 'CONCLUIDA',
  CANCELADA = 'CANCELADA',
}

export class VendaDto {
  @IsInt()
  @IsOptional()
  id!: number;

  @IsUUID()
  @IsNotEmpty()
  idCliente!: string;

  @IsUUID()
  @IsNotEmpty()
  idVendedor!: string;

  @IsOptional()
  @IsDateString()
  dataVenda!: Date;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  valorTotal!: number;

  @IsOptional()
  @IsEnum(StatusVendaEnum)
  statusVenda!: StatusVendaEnum;

  @IsOptional()
  @IsDateString()
  dataCancelada!: Date;
}

export interface ProdutoItemDto {
  descricao: string;
  quantidade: number;
  valorUnitario: number;
}

export interface ItemVendaDto {
  cnpjCpf: string;
  produtos: ProdutoItemDto[];
}
