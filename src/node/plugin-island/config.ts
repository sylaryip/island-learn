import fs from 'fs-extra';
import { PACKAGE_ROOT, PUBLIC_DIR } from 'node/constants';
import { join, relative } from 'path';
import { SiteConfig } from 'shared/types/index';
import sirv from 'sirv';
import { Plugin } from 'vite';

const SITE_DATA_ID = 'island:site-data';

export function pluginConfig(
  config: SiteConfig,
  restart?: () => Promise<void>
): Plugin {
  return {
    name: 'island:config',
    resolveId(id) {
      if (id === SITE_DATA_ID) {
        return '\0' + SITE_DATA_ID;
      }
    },
    load(id) {
      if (id === '\0' + SITE_DATA_ID) {
        return `export default ${JSON.stringify(config.siteData)}`;
      }
    },
    config() {
      return {
        root: PACKAGE_ROOT,
        resolve: {
          alias: {
            '@runtime': join(PACKAGE_ROOT, 'src', 'runtime', 'index.ts')
          }
        },
        css: {
          modules: {
            localsConvention: 'camelCaseOnly'
          }
        }
      };
    },
    async handleHotUpdate(ctx) {
      const customWatchedFiles = config.userConfigDeps;
      const include = (id: string) =>
        customWatchedFiles.some((f) => id.includes(f));
      if (include(ctx.file)) {
        console.log(
          `\n${relative(config.root, ctx.file)} changed, restart server...`
        );

        await restart();
      }
    },
    configureServer(server) {
      const publicDir = join(config.root, PUBLIC_DIR);
      if (fs.pathExistsSync(publicDir)) {
        server.middlewares.use(sirv(publicDir));
      }
    }
  };
}
