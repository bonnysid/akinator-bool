import { Navigate, RouteObject } from 'react-router-dom';
import { Layout, MenuGroupType } from '@/components';
import { AkinatorPage, BooleanPage, ExpressionPage } from '@/pages';

export enum Routes {
  GAME = '/game',
  BOOLEAN = '/boolean',
  EXPRESSION = '/expression',
}

export const LINKS: MenuGroupType[] = [
  {
    links: [
      {
        id: Routes.GAME,
        caption: 'Акинатор',
        link: Routes.GAME,
        iconType: 'question-mark-circle',
      },
      {
        id: Routes.BOOLEAN,
        caption: 'Истина или нет',
        link: Routes.BOOLEAN,
        iconType: 'check',
      },
      {
        id: Routes.EXPRESSION,
        caption: 'КНФ и ДНФ',
        link: Routes.EXPRESSION,
        iconType: 'arrow-right',
      },
    ]
  }
]

export const ROUTES: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        path: '',
        element: <Navigate to={Routes.GAME} />,
      },
      {
        path: Routes.GAME,
        element: <AkinatorPage />
      },
      {
        path: Routes.BOOLEAN,
        element: <BooleanPage />
      },
      {
        path: Routes.EXPRESSION,
        element: <ExpressionPage />
      },
      {
        path: '*',
        element: <Navigate to={Routes.GAME} />,
      },
    ]
  }
]
