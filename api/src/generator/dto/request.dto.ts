import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class GenerateCodeDto {
  @ApiProperty({ type: 'string', format: 'uuid', isArray: true })
  @IsNotEmpty()
  @IsArray()
  schemas: string[];

  @ApiProperty({ type: 'string' })
  @IsObject()
  pathMap: {
    [key: string]: {
      type: string;
      path: string;
    };
  };

  @ApiProperty({ type: 'object', isArray: true })
  @IsArray()
  paths: {
    type: string;
    path: string;
  }[];
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
