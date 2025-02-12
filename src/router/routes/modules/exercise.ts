import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';

const exercise: AppRouteModule = {
  path: '/exercise',
  name: 'Exercise',
  component: LAYOUT,
  redirect: '/exercise/index',
  meta: {
    orderNo: 10,
    icon: 'ion:layers-outline',
    title: t('routes.page.exerciseManagement'),
  },
  children: [
    {
      path: '/exercise/index',
      name: 'HomeworkList',
      component: () => import('@/views/exercise/index.vue'),
      meta: {
        title: t('routes.page.homeworkList'),
      },
    },
    // {
    //   path: '/exercise/index',
    //   name: 'AssignHomework',
    //   component: () => import('@/views/exercise/index.vue'),
    //   meta: {
    //     title: t('routes.page.assignHomework'),
    //   },
    // },
    // {
    //   path: '/exercise/reading',
    //   name: 'ReadingExercise',
    //   component: () => import('@/views/exercise/reading.vue'),
    //   meta: {
    //     title: t('routes.page.reading'),
    //   },
    // },
    // {
    //   path: '/exercise/listening',
    //   name: 'ListeningExercise',
    //   component: () => import('@/views/exercise/listening.vue'),
    //   meta: {
    //     title: t('routes.page.listening'),
    //   },
    // },
    // {
    //   path: '/exercise/writing',
    //   name: 'WritingExercise',
    //   component: () => import('@/views/exercise/writing.vue'),
    //   meta: {
    //     title: t('routes.page.writing'),
    //   },
    // },
    // {
    //   path: '/exercise/speaking',
    //   name: 'SpeakingExercise',
    //   component: () => import('@/views/exercise/speaking.vue'),
    //   meta: {
    //     title: t('routes.page.speaking'),
    //   },
    // },
  ],
};

export default exercise;
