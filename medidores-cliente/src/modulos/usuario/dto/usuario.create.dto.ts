import {
  IsArray, IsBoolean,
  IsNotEmpty,
  IsNumber, IsNumberString, IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MedidorCreateDto } from '../../medidor/dto/medidor.create.dto';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nombres requerido',
    example: 'Alisson Monserratte',
  })
  @IsNotEmpty()
  @IsString()
  nombres: string;

  @ApiProperty({
    description: 'Apellido requerido',
    example: 'López Mejía',
  })
  @IsNotEmpty()
  @IsString()
  apellidos: string;

  @ApiProperty({
    description: 'Celular requerido',
    example: '0999780981',
  })
  @IsNotEmpty()
  @IsString()
  celular: string;

  @IsNotEmpty()
  @IsNumberString()
  cedula: string;

  @IsNotEmpty()
  @IsString()
  correo: string;

  @IsNotEmpty()
  @IsString()
  direccion: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsBoolean()
  terminosCond: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedidorCreateDto)
  medidores?: MedidorCreateDto[];
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UsuarioPassDto {
  @IsNotEmpty()
  @IsNumberString()
  cedula: string;

  @IsNotEmpty()
  @IsString()
  password: string;


}
