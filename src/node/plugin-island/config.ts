import { Plugin } from 'vite';
import { SiteConfig } from 'shared/types/index';
import { relative } from 'path';

const SITE_DATA_ID = 'island:site-data';

export function pluginConfig(
  config: SiteConfig,
  restart: () => Promise<void>
): Plugin {
  return {
    name: 'island:site-data',
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
    }
  };
}
