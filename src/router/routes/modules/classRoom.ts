import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';

const classRoom: AppRouteModule = {
  path: '/classes',
  name: 'ClassRoom',
  component: LAYOUT,
  redirect: '/classes/index',
  meta: {
    orderNo: 90000,
    hideChildrenInMenu: true,
    icon: 'whh:paintroll',
    title: t('routes.page.classRoomList'),
  },
  children: [
    {
      path: 'index',
      name: 'ClassList',
      component: () => import('@/views/class-room/index.vue'),
      meta: {
        title: t('routes.page.classRoomList'),
        icon: 'whh:paintroll',
        hideMenu: true,
      },
    },
  ],
};

export default classRoom;
