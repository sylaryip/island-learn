import pluginReact from '@vitejs/plugin-react';
import { createServer } from 'vite';
import { resolveConfig } from './config';
import { PACKAGE_ROOT } from './constants';
import { pluginConfig } from './plugin-island/config';
import { pluginIndexHtml } from './plugin-island/indexHtml';

export async function createDevServer(
  root: string,
  restart: () => Promise<void>
) {
  const config = await resolveConfig(root, 'serve', 'development');
  console.log(config);
  return createServer({
    root,
    plugins: [pluginIndexHtml(), pluginReact(), pluginConfig(config, restart)],

    server: {
      fs: { allow: [PACKAGE_ROOT] }
    }
  });
}
