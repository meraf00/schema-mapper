import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Table } from './table.entity';

export enum AttributeType {
  CHAR = 'CHAR',
  VARCHAR = 'VARCHAR',
  TEXT = 'TEXT',
  BOOLEAN = 'BOOLEAN',
  TINYINT = 'TINYINT',
  INTEGER = 'INTEGER',
  BIGINT = 'BIGINT',
  FLOAT = 'FLOAT',
  DOUBLE = 'DOUBLE',
  DATE = 'DATE',
  TIME = 'TIME',
  TIMESTAMP = 'TIMESTAMP',
}

export enum RelationType {
  ONE_TO_ONE = 'ONE_TO_ONE',
  MANY_TO_ONE = 'MANY_TO_ONE',
}

@Entity({ name: 'attribute' })
@Unique(['name', 'tableId'])
export class Attribute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: AttributeType,
    default: AttributeType.VARCHAR,
  })
  type: AttributeType;

  @Column({ default: false })
  isNullable: boolean;

  @Column({ default: false })
  isUnique: boolean;

  @Column({ default: false })
  isPrimary: boolean;

  @Column({ default: false })
  isForeign: boolean;

  @Column({ default: false })
  isGenerated: boolean;

  @ManyToOne(() => Attribute, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn()
  references: Attribute;

  @Column({ nullable: true })
  backref: string;

  @Column({
    type: 'enum',
    enum: RelationType,
    nullable: true,
  })
  relationType: RelationType;

  @ManyToOne(() => Table, (table) => table.attributes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  table: Table;

  @Column()
  tableId: string;
}
