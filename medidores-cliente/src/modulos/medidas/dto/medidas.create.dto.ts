import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MedidasCreateDto {
  @ApiProperty({
    description: 'Fecha requerida',
    example: '01/04/22',
  })
  @IsNotEmpty()
  @IsString()
  fecha: string;

  @ApiProperty({
    description: 'Medida requerida',
    example: '0.09',
  })
  @IsNotEmpty()
  @IsNumber()
  medida: number;

  @ApiProperty({
    description: 'Voltaje L1 requerido',
    example: '0.09',
  })
  @IsNotEmpty()
  @IsNumber()
  vL1: number;

  @ApiProperty({
    description: 'Volataje L2 requerida',
    example: '0.09',
  })
  @IsNotEmpty()
  @IsNumber()
  vL2: number;

  @ApiProperty({
    description: 'Corriente L1 requerida',
    example: '0.09',
  })
  @IsNotEmpty()
  @IsNumber()
  aL1: number;

  @ApiProperty({
    description: 'Corriente L2 requerida',
    example: '0.09',
  })
  @IsNotEmpty()
  @IsNumber()
  aL2: number;
}

export class UpdateMedidasDto extends PartialType(MedidasCreateDto) {}
