import { Injectable } from '@nestjs/common';
import { SchemaService } from './schema.service';
import { Attribute, Table } from '../entities';
import { AttributeType, RelationType } from '../entities/attribute.entity';

@Injectable()
export class CodeGenerationService {
  constructor(private schemaService: SchemaService) {}

  typeMap(attribType: AttributeType) {
    switch (attribType) {
      case AttributeType.CHAR:
      case AttributeType.VARCHAR:
      case AttributeType.TEXT:
        return 'string';
      case AttributeType.BOOLEAN:
        return 'boolean';
      case AttributeType.TINYINT:
      case AttributeType.INTEGER:
      case AttributeType.BIGINT:
      case AttributeType.FLOAT:
      case AttributeType.DOUBLE:
        return 'number';
      case AttributeType.DATE:
      case AttributeType.TIME:
      case AttributeType.TIMESTAMP:
        return 'Date';
      default:
        throw new Error(`Unknown type: ${attribType}`);
    }
  }

  merge(dependency, other) {
    dependency.Entity = dependency.Entity || other.Entity;
    dependency.PrimaryGeneratedColumn =
      dependency.PrimaryGeneratedColumn || other.Entity;
    dependency.Column = dependency.Column || other.Column;
    dependency.ManyToOne = dependency.ManyToOne || other.ManyToOne;
    dependency.OneToOne = dependency.OneToOne || other.OneToOne;
    dependency.Unique = dependency.Unique || other.Unique;
    dependency.JoinColumn = dependency.JoinColumn || other.JoinColumn;
  }

  async buildAttrib(attribute: Attribute): Promise<[any, any]> {
    const dependency = {
      Entity: false,
      PrimaryGeneratedColumn: attribute.isPrimary,
      Column: false,
      ManyToOne: attribute.relationType === RelationType.MANY_TO_ONE,
      OneToMany: false,
      OneToOne: attribute.relationType === RelationType.ONE_TO_ONE,
      Unique: attribute.isUnique,
      JoinColumn: false,
    };

    const props = [];
    if (attribute.isNullable) {
      props.push('nullable: true');
    }
    if (attribute.isUnique) {
      props.push('unique: true');
    }

    let strProps = '';
    if (props.length) {
      strProps = `{${props.join(', ')}}`;
    }

    const code = [];

    if (!attribute.references) {
      if (attribute.isPrimary && attribute.isGenerated) {
        code.push(`\t@PrimaryGeneratedColumn(${strProps})`);
      } else if (attribute.isGenerated) {
        code.push(`\t@Column(${strProps})`);
        code.push(`\t@Generated()`);
      } else if (attribute.isPrimary) {
        code.push(`\t@PrimaryColumn(${strProps})`);
      } else {
        code.push(`\t@Column(${strProps})`);
      }
    } else if (attribute.relationType === RelationType.ONE_TO_ONE) {
      const refTable = attribute.references.table.name;
      code.push(
        `\t@OneToOne(() => ${refTable}, (${refTable.toLocaleLowerCase()}) => ${refTable.toLocaleLowerCase()}.${attribute.table.name.toLocaleLowerCase()}), ${strProps})`,
      );
    } else if (attribute.relationType === RelationType.MANY_TO_ONE) {
      const refTable = attribute.references.table.name;
      code.push(
        `\t@ManyToOne(() => ${refTable}, (${refTable.toLocaleLowerCase()}) => ${refTable.toLocaleLowerCase()}.${attribute.table.name.toLocaleLowerCase()}s), ${strProps})`,
      );
    }

    code.push(`\t${attribute.name}: ${this.typeMap(attribute.type)};`);

    return [dependency, code.join('\n')];
  }

  async buildTable(table: Table): Promise<[any, any]> {
    const dependency = {
      Entity: true,
      PrimaryGeneratedColumn: false,
      Column: false,
      ManyToOne: false,
      OneToMany: false,
      OneToOne: false,
      Unique: false,
      JoinColumn: false,
    };

    const attributesCode = [];
    for (let attribute of table.attributes) {
      const [attribDep, attribCode] = await this.buildAttrib(attribute);
      this.merge(dependency, attribDep);
      attributesCode.push(attribCode);
    }

    const tableCode = `@Entity()\nclass ${table.name} {\n${attributesCode.join('\n\n')}\n}`;

    return [dependency, tableCode];
  }

  async generateCode(schemaId: string) {
    const schema = await this.schemaService.findOne(schemaId);

    const dependency = {
      Entity: false,
      PrimaryGeneratedColumn: false,
      Column: false,
      ManyToOne: false,
      OneToMany: false,
      OneToOne: false,
      Unique: false,
      JoinColumn: false,
    };

    const tablesCode = [];

    for (let table of schema.tables) {
      const [tableDep, tableCode] = await this.buildTable(table);
      this.merge(dependency, tableDep);
      tablesCode.push(tableCode);
    }

    const deps = [];

    for (let dep in dependency) {
      if (dependency[dep]) {
        deps.push(dep);
      }
    }

    const schemaCode = [`import {${deps.join(', ')}} from 'typeorm';`];

    return schemaCode.concat(tablesCode).join('\n\n\n');
  }
}
