import { Test, TestingModule } from '@nestjs/testing';
import { CodeGenerationService } from './codegeneration.service';

describe('CodegenerationService', () => {
  let service: CodeGenerationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CodeGenerationService],
    }).compile();

    service = module.get<CodeGenerationService>(CodeGenerationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
