import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
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

@Entity()
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

  @OneToOne(() => Attribute, { nullable: true, cascade: true })
  @JoinColumn()
  references: Attribute;

  @ManyToOne(() => Table, (table) => table.attributes, { nullable: false })
  table: Table;

  @Column()
  tableId: string;
}
