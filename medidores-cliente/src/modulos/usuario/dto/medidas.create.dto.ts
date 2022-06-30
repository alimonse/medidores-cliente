import { ApiProperty, PartialType} from '@nestjs/swagger';
import {IsNotEmpty, IsNumber, IsString} from 'class-validator';

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
}

export class UpdateMedidasDto extends PartialType(MedidasCreateDto) {}
