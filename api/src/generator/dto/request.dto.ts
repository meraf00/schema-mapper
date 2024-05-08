import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class GenerateCodeDto {
  @ApiProperty({ type: 'string', format: 'uuid', isArray: true })
  @IsNotEmpty()
  @IsArray()
  schemas: string[];

  @ApiProperty({ type: 'string', format: 'uuid' })
  @IsNotEmpty()
  @IsString()
  template: string;
}

export class CreateTemplateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;
}

export class UpdateTemplateDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  content: string;
}
