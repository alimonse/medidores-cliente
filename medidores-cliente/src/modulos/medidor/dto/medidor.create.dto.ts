import { ApiProperty, PartialType } from '@nestjs/swagger';
import {IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested} from 'class-validator';
import { Type } from 'class-transformer';
import { MedidasCreateDto } from '../../medidas/dto/medidas.create.dto';

export class MedidorCreateDto {
  @ApiProperty({
    description: 'Nombres requerido',
    example: '2022099009',
  })
  @IsNotEmpty()
  @IsString()
  numMedidor: string;

  @ApiProperty({
    description: 'Estado requerido',
    example: 1,
  })
  @IsNotEmpty()
  @IsBoolean()
  estado: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedidasCreateDto)
  medidas?: MedidasCreateDto[];
}

export class UpdateMedidorDto extends PartialType(MedidorCreateDto) {}
