<template>
  <div>
    <BasicTable @register="registerTable">
      <template #form-custom> custom-slot </template>
      <template #toolbar>
        <a-button type="primary" @click="getFormValues">{{ t('table.enterData') }}</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <Tag :color="record.status === 'v' ? 'green' : 'red'">
            {{ record.status }}
          </Tag>
        </template>
        <template v-if="column.key === 'action' && record.status === 'v'">
          <Tooltip>
            <template #title>
              <div>{{ t('common.grading.text') }}</div>
            </template>
            <a-button size="small" preIcon="ant-design:edit-filled" />
          </Tooltip>
        </template>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable } from '@/components/Table';
  import { getExerciseColumns, getSearchFormConfig } from '@/views/classroom/tableData';
  import { exerciseListApi } from '@/api/demo/table';
  import { useI18n } from '@/hooks/web/useI18n';
  import { Tag, Tooltip } from 'ant-design-vue';

  const { t } = useI18n();
  const [registerTable, { getForm }] = useTable({
    title: t('routes.page.exerciseList'),
    api: exerciseListApi(),
    columns: getExerciseColumns(),
    useSearchForm: true,
    formConfig: getSearchFormConfig(),
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    rowKey: 'id',
    showSelectionBar: false,
    actionColumn: {
      title: t('table.action'),
      dataIndex: 'action',
    },
  });

  function getFormValues() {
    console.log(getForm().getFieldsValue());
  }
</script>
