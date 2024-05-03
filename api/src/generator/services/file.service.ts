import * as fs from 'fs';
import * as path from 'path';
import * as archiver from 'archiver';
import * as prettier from 'prettier';
import { Injectable } from '@nestjs/common';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class FileService {
  storagePath: string;
  scaffoldPath: string;

  constructor() {
    this.storagePath = path.join(process.cwd(), 'storage');
    this.scaffoldPath = path.join(process.cwd(), 'storage/base');
  }

  async createScaffoldDir() {
    const tempFolder = path.join(this.storagePath, uuid4());

    if (fs.existsSync(tempFolder)) {
      fs.rmSync(tempFolder, {
        force: true,
        recursive: true,
      });
    }

    await fs.promises.mkdir(tempFolder, { recursive: true });
    fs.cpSync(this.scaffoldPath, tempFolder, { recursive: true });

    return tempFolder;
  }

  async createFile(
    workingDir: string,
    relativeFilePath: string,
    content: string,
  ) {
    const filePath = path.join(workingDir, relativeFilePath + '.ts');
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

    try {
      fs.writeFileSync(
        filePath,
        await prettier.format(content, { parser: 'typescript' }),
        {
          encoding: 'utf-8',
        },
      );
    } catch (e) {
      console.log(filePath, e.message);
      fs.writeFileSync(filePath, content, {
        encoding: 'utf-8',
      });
    }
  }

  async archive(folderPath: string, outputFilePath?: string): Promise<string> {
    const ar = archiver.create('zip', {});

    if (!outputFilePath) {
      outputFilePath = path.join(
        this.storagePath,
        path.basename(folderPath) + '.zip',
      );
    }

    const output = fs.createWriteStream(outputFilePath, {
      flags: 'w',
    });

    return await new Promise((resolve, reject) => {
      output.on('close', () => {
        console.log('ZIP file written to:', outputFilePath);
        resolve(outputFilePath);
      });

      ar.on('error', (err) => {
        console.error('error compressing: ', err);
        reject(err);
      });

      ar.pipe(output);

      ar.directory(path.normalize(folderPath), false).finalize();
    });
  }
}
