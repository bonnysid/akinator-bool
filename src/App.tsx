import '@/assets/global.scss';
import '@/assets/variables.module.scss';
import { ROUTES } from '@/router';
import { useRoutes } from 'react-router-dom';

function App() {
  const routes = useRoutes(ROUTES);

  return (
    <>
      {routes}
    </>
  )
}

export default App
