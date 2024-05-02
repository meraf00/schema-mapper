import * as fs from 'fs';
import * as path from 'path';
import * as archiver from 'archiver';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileService {
  storagePath: string;
  scaffoldPath: string;

  constructor() {
    this.storagePath = path.join(process.cwd(), 'storage');
    this.scaffoldPath = path.join(process.cwd(), 'storage/base');
  }

  async createFile(filepath: string, content: string) {}

  async createFolder(folderPath: string) {}

  async deleteFolder(folderPath: string) {}

  async zipFolder(folderPath: string, zipFilepath: string): Promise<string> {
    return '';
  }
}
