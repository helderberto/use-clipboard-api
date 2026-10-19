// @vitest-environment node
/// <reference types="node" />
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { build } from 'tsup';
import config from '../../tsup.config';

let outDir: string;

beforeAll(async () => {
  outDir = await mkdtemp(join(tmpdir(), 'use-clipboard-api-'));
  await build({ ...config, outDir, dts: false, silent: true });
}, 30_000);

afterAll(() => rm(outDir, { recursive: true, force: true }));

describe('build', () => {
  it.each(['index.mjs', 'index.js'])(
    'marks %s as a client module',
    async (file) => {
      const code = await readFile(join(outDir, file), 'utf8');

      expect(code.startsWith("'use client';")).toBe(true);
    },
  );
});
