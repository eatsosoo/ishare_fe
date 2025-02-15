<template>
  <BasicTable @register="registerTable" ref="selectTable">
    <template #toolbar>
      <a-button type="primary" @click="getSelectRows" class="bg-[danger]">{{
        t('table.blockAccount')
      }}</a-button>
      <a-button type="default" @click="getSelectRows" class="bg-[success]">{{
        t('table.unblockAccount')
      }}</a-button>
    </template>
    <template #bodyCell="{ column }">
      <template v-if="column.key === 'action'">
        <Icon :size="20" icon="ant-design:swap-outlined" class="mr-2 cursor-pointer" />
      </template>
    </template>
  </BasicTable>
</template>

<script setup lang="ts">
  import { getAllUserListApi } from '@/api/sys/user';
  import Icon from '@/components/Icon/Icon.vue';
  import { BasicTable, useTable } from '@/components/Table';
  import { useI18n } from '@/hooks/web/useI18n';
  import { getAccountColumns, getSearchUserConfig } from '@/views/classroom/tableData';

  const { t } = useI18n();
  const [registerTable, { getSelectRows, clearSelectedRowKeys }] = useTable({
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
    rowSelection: {
      type: 'checkbox',
    },
    showSelectionBar: true,
  });
</script>
