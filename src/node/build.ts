import fs from 'fs-extra';
import ora from 'ora';
import { join } from 'path';
import type { RollupOutput } from 'rollup';
import { InlineConfig, build as viteBuild } from 'vite';
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants';

export async function bundle(root: string) {
  try {
    const resolveViteConfig = (isServer: boolean): InlineConfig => {
      return {
        mode: 'production',
        root,
        build: {
          ssr: isServer,
          outDir: isServer ? '.temp' : 'build',
          rollupOptions: {
            input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
            output: {
              format: isServer ? 'cjs' : 'esm'
            }
          }
        }
      };
    };
    const clientBuild = async () => {
      return viteBuild(resolveViteConfig(false));
    };

    const serverBuild = async () => {
      return viteBuild(resolveViteConfig(true));
    };

    const spinner = ora();
    spinner.start('Building client + server bundles...');
    const [clientBundle, serverBundle] = await Promise.all([
      clientBuild(),
      serverBuild()
    ]);
    spinner.succeed('Build client + server bundles done.');
    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput];
  } catch (e) {
    console.log(e);
  }
}

async function renderPage(
  render: () => string,
  root: string,
  clientBundle: RollupOutput
) {
  const appHtml = render();
  const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>title</title>
    <meta name="description" content="xxx">
</head>
<body>
    <div id="root">${appHtml}</div>
</body>
</html>
`.trim();
  await fs.writeFile(join(root, 'build', 'index.html'), html);
  await fs.remove(join(root, '.temp'));
}

export async function build(root: string) {
  // 1. bundle - client + server
  const [clientBundle] = await bundle(root);
  // 2. 引入 server-entry
  const serverEntryPath = join(process.cwd(), root, '.temp', 'ssr-entry.js');
  // 3. 服务端渲染，产出 HTML
  const { render } = await import(serverEntryPath);
  await renderPage(render, root, clientBundle);
}
