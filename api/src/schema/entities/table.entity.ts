import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Schema } from './schema.entity';
import { Attribute } from './attribute.entity';

@Entity()
@Unique(['name', 'schemaId'])
export class Table {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Attribute, (attribute) => attribute.table, {
    onDelete: 'CASCADE',
  })
  attributes: Attribute[];

  @Column()
  schemaId: string;

  @ManyToOne(() => Schema, (schema) => schema.tables, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'schemaId' })
  schema: Schema;
}
