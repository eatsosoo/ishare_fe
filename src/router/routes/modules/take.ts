import type { AppRouteModule } from '@/router/types';

import { TAKE_LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';
// import { RoleEnum } from '@/enums/roleEnum';

const take: AppRouteModule = {
  path: '/take',
  name: 'Take',
  component: TAKE_LAYOUT,
  redirect: '/take/index',
  meta: {
    orderNo: 10,
    icon: 'ion:list-outline',
    title: t('routes.page.takeManagement'),
    // roles: [RoleEnum.SUPER, RoleEnum.TEACHER],
  },
  children: [
    {
      path: '/take/index',
      name: 'TakeExam',
      component: () => import('@/views/take/index.vue'),
      meta: {
        title: '',
      },
    },
  ],
};

export default take;
