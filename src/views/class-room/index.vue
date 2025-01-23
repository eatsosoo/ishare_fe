<template>
  <BasicTable @register="registerTable">
    <template #form-custom> custom-slot </template>
    <template #toolbar>
      <a-button type="primary" @click="getFormValues">{{ t('table.enterData') }}</a-button>
    </template>
  </BasicTable>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable } from '@/components/Table';
  import { getClassColumns, getFormConfig } from '@/views/class-room/tableData';
  import { classListApi } from '@/api/demo/table';
  import { useI18n } from '@/hooks/web/useI18n';

  const { t } = useI18n();
  const [registerTable, { getForm }] = useTable({
    title: t('routes.page.classRoomList'),
    api: classListApi(),
    columns: getClassColumns(),
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    rowKey: 'id',
    showSelectionBar: false, // 显示多选状态栏
  });

  function getFormValues() {
    console.log(getForm().getFieldsValue());
  }
</script>
