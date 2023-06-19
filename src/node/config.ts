import fs from 'fs-extra';
import { resolve } from 'path';
import { loadConfigFromFile } from 'vite';
import { SiteConfig, UserConfig } from '../shared/types';

type RawConfig =
  | UserConfig
  | Promise<UserConfig>
  | (() => UserConfig | Promise<UserConfig>);

function getUserConfigPath(root: string) {
  try {
    const supportConfigFile = ['config.ts', 'config.js'];
    const configPath = supportConfigFile
      .map((file) => resolve(root, file))
      .find(fs.pathExistsSync);

    if (configPath === undefined) {
      throw new Error('Config file not found.');
    }
    return configPath;
  } catch (e) {
    console.error(`Failed to resolve config: ${e}`);
    throw e;
  }
}

export async function resolveUserConfig(
  root: string,
  command: 'serve' | 'build',
  mode: 'development' | 'production'
) {
  // 1. 获取配置文件路径， 支持 js ts
  const configPath = getUserConfigPath(root);
  // 2. 读取配置文件内容
  const result = await loadConfigFromFile(
    {
      command,
      mode
    },
    configPath,
    root
  );
  if (result) {
    const { config: rawConfig = {} as RawConfig } = result;
    let userConfigDeps = result.dependencies;
    userConfigDeps = userConfigDeps
      .filter((file) => file.startsWith(root))
      .map(
        (file) => resolve(root.replace(new RegExp(`${root}$`), '')) + `/${file}`
      );

    const userConfig = await (typeof rawConfig === 'function'
      ? rawConfig()
      : rawConfig);
    return [configPath, userConfig, userConfigDeps] as const;
  } else {
    return [configPath, {} as UserConfig, [] as string[]] as const;
  }
}

function resolveSiteData(userConfig: UserConfig): UserConfig {
  return {
    title: userConfig.title || 'Island.js',
    description: userConfig.description || 'SSG Framework',
    themeConfig: userConfig.themeConfig || {},
    vite: userConfig.vite || {}
  };
}

export async function resolveConfig(
  root: string,
  command: 'serve' | 'build',
  mode: 'development' | 'production'
): Promise<SiteConfig> {
  const [configPath, userConfig, userConfigDeps] = await resolveUserConfig(
    root,
    command,
    mode
  );
  const siteConfig: SiteConfig = {
    root,
    configPath,
    siteData: resolveSiteData(userConfig as UserConfig),
    userConfigDeps
  };
  return siteConfig;
}

export function defineConfig(config: UserConfig) {
  return config;
}
