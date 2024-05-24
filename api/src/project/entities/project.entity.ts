import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Schema } from './schema.entity';

@Entity({ name: 'projects' })
export class Project {
  @PrimaryColumn()
  stub: string;

  @Column()
  name: string;

  @OneToMany(() => Schema, (schema) => schema.project, { onDelete: 'CASCADE' })
  schemas: Schema[];
}
