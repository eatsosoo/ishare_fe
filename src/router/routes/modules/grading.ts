import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';

const grading: AppRouteModule = {
  path: '/grading',
  name: 'Grading',
  component: LAYOUT,
  redirect: '/grading/index',
  meta: {
    orderNo: 15,
    icon: 'ion:checkmark-done-outline',
    title: t('routes.page.testGradingManagement'),
  },
  children: [
    {
      path: 'index',
      name: 'GradingSearch',
      component: () => import('@/views/grading/index.vue'),
      meta: {
        title: 'Chấm bài',
      },
    },
  ],
};

export default grading;
