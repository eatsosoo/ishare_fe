import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';

const classRoom: AppRouteModule = {
  path: '/class',
  name: 'ClassRoom',
  component: LAYOUT,
  redirect: '/classes/index',
  meta: {
    orderNo: 10,
    icon: 'ion:grid-outline',
    title: t('routes.page.class'),
  },
  children: [
    {
      path: 'index',
      name: 'ClassList',
      component: () => import('@/views/class-room/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.page.classRoomList'),
      },
    },
    {
      path: 'new',
      name: 'ClassCreate',
      component: () => import('@/views/class-room/new.vue'),
      meta: {
        title: t('routes.page.createClassRoom'),
      },
    },
  ],
};

export default classRoom;
