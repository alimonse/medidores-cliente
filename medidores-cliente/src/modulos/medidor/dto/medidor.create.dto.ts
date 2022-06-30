import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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
  estado: 1 | 0;
}

export class UpdateMedidorDto extends PartialType(MedidorCreateDto) {}
