import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';
import { RoleEnum } from '@/enums/roleEnum';

const grading: AppRouteModule = {
  path: '/grading',
  name: 'Grading',
  component: LAYOUT,
  redirect: '/grading/index',
  meta: {
    orderNo: 15,
    icon: 'ion:checkmark-done-outline',
    title: t('routes.page.testGradingManagement'),
    roles: [RoleEnum.SUPER, RoleEnum.TEACHER],
  },
  children: [
    {
      path: 'index',
      name: 'GradingSearch',
      component: () => import('@/views/grading/index.vue'),
      meta: {
        title: t('routes.page.grading'),
      },
    },
    {
      path: 'practice',
      name: 'GradingPractice',
      component: () => import('@/views/grading/practice.vue'),
      meta: {
        title: t('routes.page.practiceGrading'),
      },
    },
  ],
};

export default grading;
