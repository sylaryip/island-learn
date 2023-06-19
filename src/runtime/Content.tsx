import { useRoutes } from 'react-router-dom';
import { routes } from 'island:routes';

export const Content = () => {
  return <div>Content</div>;
  const routeElement = useRoutes(routes);
  return routeElement;
};
