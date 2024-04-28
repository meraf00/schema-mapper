import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Table } from './table.entity';

@Entity()
export class Schema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Table, (table) => table.schema, { onDelete: 'CASCADE' })
  tables: Table[];
}
