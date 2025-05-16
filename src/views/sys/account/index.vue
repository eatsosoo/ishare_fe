<template>
  <BasicTable @register="registerTable" ref="selectTable">
    <!-- <template #toolbar>
      <a-button type="primary" @click="getSelectRows" class="bg-[danger]">{{
        t('table.blockAccount')
      }}</a-button>
      <a-button type="default" @click="getSelectRows" class="bg-[success]">{{
        t('table.unblockAccount')
      }}</a-button>
    </template> -->
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <Icon
          :size="20"
          icon="ant-design:swap-outlined"
          class="mr-2 cursor-pointer"
          @click="changeRole(record.id)"
        />
      </template>
    </template>
  </BasicTable>
</template>

<script setup lang="ts">
  import { changeRoleApi, getAllUserListApi } from '@/api/sys/user';
  import Icon from '@/components/Icon/Icon.vue';
  import { BasicTable, useTable } from '@/components/Table';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useMessage } from '@/hooks/web/useMessage';
  import { getAccountColumns, getSearchUserConfig } from '@/views/classroom/tableData';
  import { h } from 'vue';

  const { t } = useI18n();
  const { createMessage } = useMessage();
  const [registerTable, { reload }] = useTable({
    canResize: true,
    title: t('table.accountList'),
    titleHelpMessage: t('table.addStudentToClass'),
    api: getAllUserListApi(),
    columns: getAccountColumns(),
    defSort: {
      field: 'name',
      order: 'ascend',
    },
    rowKey: 'id',
    showTableSetting: true,
    showIndexColumn: false,
    useSearchForm: true,
    formConfig: getSearchUserConfig(),
    // rowSelection: {
    //   type: 'checkbox',
    // },
    showSelectionBar: false,
  });

  // async function changeRole(userId: number) {
  //   try {
  //     const result = await changeRoleApi({ user_id: userId, role_id: 2 });
  //     if (result) {
  //       createMessage.success(t('common.editSuccessfully'));
  //       reload();
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  const { createConfirm } = useMessage();
  const changeRole = (userId: number) => {
    createConfirm({
      iconType: 'warning',
      title: () => h('span', t('sys.app.logoutTip')),
      content: () => h('span', t('common.warning.changeRole')),
      onOk: async () => {
        try {
          const res = await changeRoleApi({ user_id: userId, role_id: 2 });
          if (res && res.items) {
            createMessage.success(t('common.editSuccessfully'));
            reload();
          }
        } catch (error) {
          console.log(error);
        }
      },
    });
  };
</script>
