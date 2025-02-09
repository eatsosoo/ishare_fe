import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';

const test: AppRouteModule = {
  path: '/test',
  name: 'Test',
  component: LAYOUT,
  redirect: '/test/index',
  meta: {
    orderNo: 10,
    icon: 'ion:list-outline',
    title: t('routes.page.testManagement'),
  },
  children: [
    {
      path: '/test/index',
      name: 'ExamList',
      component: () => import('@/views/test/index.vue'),
      meta: {
        title: t('routes.page.examList'),
      },
    },
    {
      path: '/test/reading',
      name: 'ReadingTest',
      component: () => import('@/views/test/reading.vue'),
      meta: {
        title: t('routes.page.reading'),
      },
    },
    {
      path: '/test/listening',
      name: 'ListeningTest',
      component: () => import('@/views/test/listening.vue'),
      meta: {
        title: t('routes.page.listening'),
      },
    },
    {
      path: '/test/writing',
      name: 'WritingTest',
      component: () => import('@/views/test/writing.vue'),
      meta: {
        title: t('routes.page.writing'),
      },
    },
    {
      path: '/test/speaking',
      name: 'SpeakingTest',
      component: () => import('@/views/test/speaking.vue'),
      meta: {
        title: t('routes.page.speaking'),
      },
    },
  ],
};

export default test;
