import { usePageData } from '@runtime';
import HomeHero from '../../components/HomeHero';
import HomeFeatures from '../../components/HomeFeatures';

export function HomeLayout() {
  const { frontmatter } = usePageData();
  return (
    <div>
      <HomeHero hero={frontmatter.hero} />
      <HomeFeatures features={frontmatter.features} />
    </div>
  );
}
