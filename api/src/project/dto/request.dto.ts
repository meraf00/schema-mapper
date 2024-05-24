import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  name: string;
}

export class UpdateProjectDto {
  @ApiProperty()
  @IsString()
  name: string;
}

export class CreateSchemaDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  projectStub: string;
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

  @ApiProperty()
  @IsBoolean()
  isAggregate: boolean;
}

export class UpdateTableDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsBoolean()
  isAggregate: boolean;
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

  @ApiProperty()
  @ValidateIf((o) => o.isForeign === true)
  @IsEnum(['ONE_TO_ONE', 'MANY_TO_ONE'])
  relationType: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  backref: string;
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

  @ApiProperty()
  @ValidateIf((o) => o.isForeign === true)
  @IsEnum(['ONE_TO_ONE', 'MANY_TO_ONE'])
  relationType: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  backref: string;
}
