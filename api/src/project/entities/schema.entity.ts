import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Table } from './table.entity';
import { Project } from './project.entity';

@Entity({ name: 'schemas' })
export class Schema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Table, (table) => table.schema, { onDelete: 'CASCADE' })
  tables: Table[];

  @Column()
  projectStub: string;

  @ManyToOne(() => Project, (project) => project.schemas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'projectStub' })
  project: Project;
}
