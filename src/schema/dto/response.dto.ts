import { ApiProperty } from '@nestjs/swagger';

export class SchemaDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  tables: TableDto[];
}

export class TableDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ format: 'uuid' })
  schemaId: string;

  @ApiProperty()
  attributes: AttributeDto[];
}

export class AttributeDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  isNullable: boolean;

  @ApiProperty()
  isUnique: boolean;

  @ApiProperty()
  isPrimary: boolean;

  @ApiProperty()
  isForeign: boolean;

  @ApiProperty()
  isGenerated: boolean;

  @ApiProperty()
  references: AttributeDto | null;

  @ApiProperty({ format: 'uuid' })
  tableId: string;
}
