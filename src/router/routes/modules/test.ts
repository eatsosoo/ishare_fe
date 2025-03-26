import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';
import { RoleEnum } from '@/enums/roleEnum';

const test: AppRouteModule = {
  path: '/test',
  name: 'Test',
  component: LAYOUT,
  redirect: '/test/index',
  meta: {
    orderNo: 10,
    icon: 'ion:list-outline',
    title: t('routes.page.testManagement'),
    roles: [RoleEnum.SUPER, RoleEnum.TEACHER],
  },
  children: [
    {
      path: '/test/practice',
      name: 'PracticeExamList',
      component: () => import('@/views/test/practice.vue'),
      meta: {
        title: t('routes.page.practiceTestList'),
      },
    },
    {
      path: '/test/index',
      name: 'ExamList',
      component: () => import('@/views/test/index.vue'),
      meta: {
        title: t('routes.page.examList'),
      },
    },
    {
      path: '/test/assignment',
      name: 'AssignExam',
      component: () => import('@/views/test/assignment.vue'),
      meta: {
        title: t('routes.page.assignTest'),
      },
    },
  ],
};

export default test;
