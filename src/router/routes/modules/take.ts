import type { AppRouteModule } from '@/router/types';

import { TAKE_LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';
import { RoleEnum } from '@/enums/roleEnum';

const take: AppRouteModule = {
  path: '/take',
  name: 'Take',
  component: TAKE_LAYOUT,
  redirect: '/take/index',
  meta: {
    orderNo: 10,
    icon: 'ion:list-outline',
    title: t('routes.page.takeManagement'),
    roles: [RoleEnum.STUDENT],
  },
  children: [
    {
      path: '/take/index',
      name: 'TakeExam',
      component: () => import('@/views/take/index.vue'),
      meta: {
        title: '',
        hideBreadcrumb: true,
        hideTab: true,
      },
    },
    {
      path: '/take/exercise',
      name: 'TakeExercise',
      component: () => import('@/views/take/exercise.vue'),
      meta: {
        title: '',
        hideBreadcrumb: true,
        hideTab: true,
      },
    },
    {
      path: '/take/practice',
      name: 'TakePractice',
      component: () => import('@/views/take/practice.vue'),
      meta: {
        title: '',
        hideBreadcrumb: true,
        hideTab: true,
      },
    },
  ],
};

export default take;
