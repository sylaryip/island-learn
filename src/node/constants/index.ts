import * as path from 'path';

export const PACKAGE_ROOT = path.join(__dirname, '..');
export const PUBLIC_DIR = 'public';

export const CLIENT_ENTRY_PATH = path.join(
  PACKAGE_ROOT,
  'src',
  'runtime',
  'client-entry.tsx'
);

export const SERVER_ENTRY_PATH = path.join(
  PACKAGE_ROOT,
  'src',
  'runtime',
  'ssr-entry.tsx'
);

export const DEFAULT_TEMPLATE_PATH = path.join(PACKAGE_ROOT, 'template.html');

export const MD_REGEX = /\.mdx?$/;

export const MASK_SPLITTER = '!!ISLAND!!';
