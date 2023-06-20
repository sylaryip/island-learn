import { usePageData } from '@runtime';
import { NavItemWithLink } from 'shared/types';

import styles from './index.module.scss';
import { SwitchAppearance } from '../SwitchAppearance';

function MenuItem(item: NavItemWithLink) {
  return (
    <div className="text-sm font-medium mx-3">
      <a href={item.link} className={styles.link}>
        {item.text}
      </a>
    </div>
  );
}
export function Nav() {
  const { siteData } = usePageData();
  const nav = siteData?.themeConfig?.nav ?? [];

  return (
    <header relative="~" w="full">
      <div
        flex="~"
        items="center"
        justify="between"
        className="px-8 h-14 divider-bottom"
      >
        <div>
          <a
            href="/"
            className="w-full h-full text-1rem font-semibold flex items-center"
            hover="opacity-60"
          >
            Island.js
          </a>
        </div>
        <div flex="~">
          <div flex="~">
            {nav.map((item) => (
              <MenuItem key={item.text} {...item} />
            ))}
          </div>
          <div before="menu-item-before" flex="~">
            <SwitchAppearance />
          </div>
          <div
            className={styles.socialLinkIcon}
            before="menu-item-before"
            ml="2"
          >
            <a href="/">
              <div className="i-carbon-logo-github w-5 h-5 full-current"></div>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
