import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Table } from './table.entity';
import { AttributeType } from './enums';
import { RelationType } from './enums';

@Entity({ name: 'attributes' })
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
