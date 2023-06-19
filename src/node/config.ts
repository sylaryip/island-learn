import fs from 'fs-extra';
import { resolve } from 'path';
import { loadConfigFromFile } from 'vite';
import { UserConfig } from '../shared/types';

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

export async function resolveConfig(
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

    const userConfig = await (typeof rawConfig === 'function'
      ? rawConfig()
      : rawConfig);
    return [configPath, userConfig] as const;
  } else {
    return [configPath, {} as UserConfig] as const;
  }
}
