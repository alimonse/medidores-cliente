import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

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
  @IsString()
  correo: string;

  @IsNotEmpty()
  @IsString()
  direccion: string;

  @IsNotEmpty()
  @IsArray()
  password: string[];
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
