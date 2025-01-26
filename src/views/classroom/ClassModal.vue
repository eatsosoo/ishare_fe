<template>
  <BasicModal v-bind="$attrs" title="Modal Title" width="1100px" @fullscreen="onFullscreen">
    <BasicTable @register="registerTable" ref="selectTable" />
    <template #footer></template>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, nextTick } from 'vue';
  import { BasicModal } from '@/components/Modal';
  import { BasicTable, ColumnChangeParam, useTable } from '@/components/Table';
  import { getStudentOfClassColumns } from '@/views/classroom/tableData';
  import { studentListApi } from '@/api/demo/table';
  import { useI18n } from '@/hooks/web/useI18n';

  const { t } = useI18n();
  const [registerTable] = useTable({
    canResize: true,
    title: t('table.studentOfClass'),
    titleHelpMessage: t('table.studentOfClassHelpMessage'),
    api: studentListApi(),
    columns: getStudentOfClassColumns(),
    defSort: {
      field: 'name',
      order: 'ascend',
    },
    rowKey: 'id',
    showTableSetting: true,
    showIndexColumn: false,
    onColumnsChange: (data: ColumnChangeParam[]) => {
      console.log('ColumnsChanged', data);
    },
  });

  const selectTable = ref<InstanceType<typeof BasicTable> | undefined>();

  const onFullscreen = async () => {
    await nextTick();
    selectTable.value?.redoHeight();
  };
</script>
