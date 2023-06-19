import pluginReact from '@vitejs/plugin-react';
import { createServer } from 'vite';
import { resolveConfig } from './config';
import { PACKAGE_ROOT } from './constants';
import { pluginConfig } from './plugin-island/config';
import { pluginIndexHtml } from './plugin-island/indexHtml';
import { pluginRoutes } from './plugin-routes';

export async function createDevServer(
  root: string,
  restart: () => Promise<void>
) {
  const config = await resolveConfig(root, 'serve', 'development');
  return createServer({
    root: PACKAGE_ROOT, // TODO: change back
    plugins: [
      pluginIndexHtml(),
      pluginReact(),
      pluginConfig(config, restart),
      pluginRoutes({ root: config.root })
    ],
    server: {
      fs: { allow: [PACKAGE_ROOT] }
    }
  });
}
