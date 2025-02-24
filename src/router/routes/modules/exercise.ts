import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';
import { RoleEnum } from '@/enums/roleEnum';

const exercise: AppRouteModule = {
  path: '/exercise',
  name: 'Exercise',
  component: LAYOUT,
  redirect: '/exercise/index',
  meta: {
    orderNo: 10,
    icon: 'ion:layers-outline',
    title: t('routes.page.exerciseManagement'),
    roles: [RoleEnum.SUPER, RoleEnum.TEACHER],
  },
  children: [
    {
      path: '/exercise/assignment',
      name: 'AssignHomework',
      component: () => import('@/views/exercise/assignment.vue'),
      meta: {
        title: t('routes.page.assignHomework'),
      },
    },
  ],
};

export default exercise;
