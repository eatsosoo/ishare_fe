import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';
import { RoleEnum } from '@/enums/roleEnum';

const system: AppRouteModule = {
  path: '/system',
  name: 'System',
  component: LAYOUT,
  redirect: '/system/account',
  meta: {
    orderNo: 2000,
    icon: 'ion:settings-outline',
    title: t('routes.demo.system.moduleName'),
  },
  children: [
    {
      path: 'account',
      name: 'AccountManagement',
      meta: {
        title: t('routes.demo.system.account'),
        ignoreKeepAlive: false,
        roles: [RoleEnum.SUPER],
      },
      component: () => import('@/views/sys/account/index.vue'),
    },
    {
      path: 'account_detail/:id',
      name: 'AccountDetail',
      meta: {
        hideMenu: true,
        title: t('routes.demo.system.account_detail'),
        ignoreKeepAlive: true,
        showMenu: false,
        currentActiveMenu: '/system/account',
        // roles: [RoleEnum.SUPER],
      },
      component: () => import('@/views/demo/system/account/AccountDetail.vue'),
    },
    // {
    //   path: 'role',
    //   name: 'RoleManagement',
    //   meta: {
    //     title: t('routes.demo.system.role'),
    //     ignoreKeepAlive: true,
    //     roles: [RoleEnum.SUPER],
    //   },
    //   component: () => import('@/views/demo/system/role/index.vue'),
    // },
    {
      path: 'changePassword',
      name: 'ChangePassword',
      meta: {
        title: t('routes.demo.system.password'),
        ignoreKeepAlive: true,
      },
      component: () => import('@/views/demo/system/password/index.vue'),
    },
    // {
    //   path: 'line',
    //   name: 'Line',
    //   component: () => import('@/views/demo/charts/Line.vue'),
    //   meta: {
    //     title: t('routes.demo.charts.line'),
    //   },
    // },
  ],
};

export default system;
