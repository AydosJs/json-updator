import {
  HeadContent,
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { HomePage } from '@/pages/home'
import { PlaygroundPage } from '@/pages/playground'

const APP_NAME = 'JSON Update'
const DEFAULT_DESCRIPTION =
  'Upload and edit localization JSON files. Merge keys, edit translations, and download updated locale files.'

const rootRoute = createRootRoute({
  head: () => ({
    meta: [
      { title: APP_NAME },
      { name: 'description', content: DEFAULT_DESCRIPTION },
    ],
  }),
  component: () => (
    <>
      <HeadContent />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
  head: () => ({
    meta: [
      { title: `${APP_NAME} – Upload locale files` },
      {
        name: 'description',
        content:
          'Upload multiple localization JSON files (e.g. English, Russian, Uzbek). Edit and download updated locale files.',
      },
    ],
  }),
})

const playgroundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/playground',
  component: PlaygroundPage,
  head: () => ({
    meta: [
      { title: `Locale table – ${APP_NAME}` },
      {
        name: 'description',
        content: 'Edit translation keys and download updated JSON locale files.',
      },
    ],
  }),
})

const routeTree = rootRoute.addChildren([indexRoute, playgroundRoute])

export const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
  interface HistoryState {
    localeFiles?: Array<{ name: string; data: Record<string, unknown> }>
  }
}
