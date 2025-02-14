<template>
  <div>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <Tag :color="record.status === 'v' ? 'green' : 'red'">
            {{ record.status }}
          </Tag>
        </template>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts" setup>
  import BasicTable from '@/components/Table/src/BasicTable.vue';
  import { useTable } from '@/components/Table';
  import { useI18n } from '@/hooks/web/useI18n';
  import { getExamColumns, getSearchExamOfStudentConfig } from '@/views/classroom/tableData';
  import { Tag } from 'ant-design-vue';
  import { getExamCapacityApi } from '@/api/student/student';

  const { t } = useI18n();

  const [registerTable] = useTable({
    api: getExamCapacityApi(),
    columns: getExamColumns(),
    useSearchForm: true,
    formConfig: getSearchExamOfStudentConfig(),
    showTableSetting: false,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    rowKey: 'id',
    showSelectionBar: false,
    actionColumn: {
      title: t('table.action'),
      dataIndex: 'action',
    },
  });
</script>
