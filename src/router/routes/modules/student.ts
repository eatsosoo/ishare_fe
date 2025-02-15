import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';
import { RoleEnum } from '@/enums/roleEnum';

const student: AppRouteModule = {
  path: '/student',
  name: 'Student',
  component: LAYOUT,
  redirect: '/student/index',
  meta: {
    orderNo: 25,
    icon: 'ion:edit',
    title: t('routes.page.studentManagement'),
    roles: [RoleEnum.STUDENT],
  },
  children: [
    {
      path: 'homework',
      name: 'Homework',
      component: () => import('@/views/student/homework.vue'),
      meta: {
        title: t('routes.page.homework'),
      },
    },
    {
      path: 'exam',
      name: 'Exam',
      component: () => import('@/views/student/exam.vue'),
      meta: {
        title: t('routes.page.takeTheTest'),
      },
    },
    {
      path: 'outcomes',
      name: 'Outcomes',
      component: () => import('@/views/student/outcomes.vue'),
      meta: {
        title: t('routes.page.learningOutcomes'),
      },
    },
  ],
};

export default student;
