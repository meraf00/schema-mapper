import { ApiProperty } from '@nestjs/swagger';

export class GenerateCodeDto {
  @ApiProperty({ type: 'string', format: 'uuid', isArray: true })
  schemas: string[];
}
