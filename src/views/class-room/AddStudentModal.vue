<template>
  <BasicModal v-bind="$attrs" title="Modal Title" width="1100px" @fullscreen="onFullscreen">
    <BasicTable @register="registerTable" ref="selectTable" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, nextTick } from 'vue';
  import { BasicModal } from '@/components/Modal';
  import { BasicTable, ColumnChangeParam, useTable } from '@/components/Table';
  import { getStudentColumns } from '@/views/class-room/tableData';
  import { studentListApi } from '@/api/demo/table';
  import { useI18n } from '@/hooks/web/useI18n';

  const { t } = useI18n();
  const [registerTable] = useTable({
    canResize: true,
    title: t('table.addStudent'),
    titleHelpMessage: t('table.addStudentToClass'),
    api: studentListApi(),
    columns: getStudentColumns(),
    defSort: {
      field: 'name',
      order: 'ascend',
    },
    rowKey: 'id',
    showTableSetting: true,
    showIndexColumn: false,
    rowSelection: {
      type: 'checkbox',
    },
    showSelectionBar: true,
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
