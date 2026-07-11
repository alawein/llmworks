import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const staleRepositorySlug = ['aegis', 'ai', 'evaluator'].join('-');
const searchableExtensions = new Set([
  '.cjs',
  '.js',
  '.json',
  '.md',
  '.mjs',
  '.ts',
  '.tsx',
  '.yaml',
  '.yml',
]);
const skippedDirectories = new Set([
  '.git',
  '.vercel',
  'coverage',
  'dist',
  'node_modules',
  'playwright-report',
  'test-results',
]);

async function collectSearchableFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        if (skippedDirectories.has(entry.name)) {
          return [];
        }

        return collectSearchableFiles(entryPath);
      }

      if (!entry.isFile() || !searchableExtensions.has(path.extname(entry.name))) {
        return [];
      }

      return [entryPath];
    })
  );

  return files.flat();
}

describe('repository links', () => {
  it('does not reference the retired repository slug', async () => {
    const files = await collectSearchableFiles(process.cwd());
    const matches: string[] = [];

    await Promise.all(
      files.map(async (filePath) => {
        const contents = await readFile(filePath, 'utf8');
        if (contents.includes(staleRepositorySlug)) {
          matches.push(path.relative(process.cwd(), filePath));
        }
      })
    );

    expect(matches).toEqual([]);
  });
});
