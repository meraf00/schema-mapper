import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class CreateSchemaDto {
  @ApiProperty()
  @IsString()
  name: string;
}

export class UpdateSchemaDto {
  @ApiProperty()
  @IsString()
  name: string;
}

export class CreateTableDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsUUID()
  schemaId: string;
}

export class UpdateTableDto {
  @ApiProperty()
  @IsString()
  name: string;
}

export class CreateAttributeDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsUUID()
  tableId: string;

  @ApiProperty()
  @IsBoolean()
  isNullable: boolean;

  @ApiProperty()
  @IsBoolean()
  isUnique: boolean;

  @ApiProperty()
  @IsBoolean()
  isPrimary: boolean;

  @ApiProperty()
  @IsBoolean()
  isForeign: boolean;

  @ApiProperty()
  @IsBoolean()
  isGenerated: boolean;

  @ApiProperty()
  @ValidateIf((o) => o.isForeign === true)
  @IsUUID()
  references: string;
}

export class UpdateAttributeDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  type: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isNullable: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isUnique: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isPrimary: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isForeign: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isGenerated: boolean;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  references: string;
}
