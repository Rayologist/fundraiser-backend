import puppeteer, { PDFOptions } from 'puppeteer';

import * as fs from 'fs/promises';
import * as path from 'path';
import { Recipe } from 'muhammara';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PdfService {
  async generate(html: string, pdfOptions?: PDFOptions) {
    const browser = await puppeteer.launch({
      headless: 'shell',
      args: ['--no-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, {
        waitUntil: ['domcontentloaded', 'networkidle0'],
      });

      const pdf = await page.pdf({
        width: '160mm',
        height: '280mm',
        ...pdfOptions,
      });

      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }

  async encrypt(args: { source: Buffer; password: string; tmpPath: string }) {
    const { source, password, tmpPath } = args;

    const exists = await dirExists(tmpPath);

    if (!exists) {
      await fs.mkdir(tmpPath, { recursive: true });
    }

    const sourcePath = path.join(tmpPath, `tmp-${Date.now()}.pdf`);
    const targetPath = path.join(tmpPath, `tmp-${Date.now()}-encrypted.pdf`);
    await fs.writeFile(sourcePath, source);

    const doc = new Recipe(sourcePath, targetPath);

    try {
      doc
        .encrypt({
          userPassword: password,
          ownerPassword: password,
          userProtectionFlag: 4,
        })
        .endPDF();

      const file = await fs.readFile(targetPath);

      return file;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      await fs.unlink(sourcePath);
      await fs.unlink(targetPath);
    }
  }
}

async function dirExists(dir: string) {
  try {
    await fs.stat(dir);
    return true;
  } catch (error) {
    return false;
  }
}
