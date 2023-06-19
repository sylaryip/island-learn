import fs from 'fs-extra';
import path from 'path';
import type { RollupOutput } from 'rollup';
import { SiteConfig } from 'shared/types';
import { InlineConfig, build as viteBuild } from 'vite';
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants';
import { createVitePlugins } from './vitePlugins';

export async function bundle(root: string, config: SiteConfig) {
  const resolveViteConfig = (isServer: boolean): InlineConfig => ({
    mode: 'production',
    root,
    plugins: createVitePlugins(config),
    ssr: {
      noExternal: ['react-router-dom']
    },
    build: {
      minify: false,
      ssr: isServer,
      outDir: isServer ? path.join(root, '.temp') : 'build',
      rollupOptions: {
        input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
        output: {
          format: isServer ? 'cjs' : 'esm'
        }
      }
    }
  });
  // const spinner = ora();
  // spinner.start(`Building client + server bundles...`);

  try {
    const [clientBundle, serverBundle] = await Promise.all([
      // client build
      viteBuild(resolveViteConfig(false)),
      // server build
      viteBuild(resolveViteConfig(true))
    ]);
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
  await fs.writeFile(path.join(root, 'build', 'index.html'), html);
  await fs.remove(path.join(root, '.temp'));
}

export async function build(root: string = process.cwd(), config: SiteConfig) {
  // 1. bundle - client + server
  const [clientBundle] = await bundle(root, config);
  // 2. 引入 server-entry
  const serverEntryPath = path.join(root, '.temp', 'ssr-entry.js');
  // 3. 服务端渲染，产出 HTML
  const { render } = await import(serverEntryPath);
  try {
    await renderPage(render, root, clientBundle);
  } catch (e) {
    console.log('Render page error.\n', e);
  }
}
