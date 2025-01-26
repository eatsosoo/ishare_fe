import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';

const classroom: AppRouteModule = {
  path: '/class',
  name: 'Classroom',
  component: LAYOUT,
  redirect: '/class/index',
  meta: {
    orderNo: 10,
    icon: 'ion:grid-outline',
    title: t('routes.page.classManager'),
  },
  children: [
    {
      path: 'index',
      name: 'ClassList',
      component: () => import('@/views/classroom/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.page.classroomList'),
      },
    },
    {
      path: 'new',
      name: 'ClassCreate',
      component: () => import('@/views/classroom/new.vue'),
      meta: {
        title: t('routes.page.createClassroom'),
      },
    },
  ],
};

export default classroom;
