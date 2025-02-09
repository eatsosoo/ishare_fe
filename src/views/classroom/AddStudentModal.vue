<template>
  <BasicModal
    v-bind="$attrs"
    title="Modal Title"
    width="1100px"
    :can-fullscreen="false"
    @ok="getSelectStudents"
  >
    <BasicTable @register="registerTable" ref="selectTable" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal } from '@/components/Modal';
  import { BasicTable, ColumnChangeParam, useTable } from '@/components/Table';
  import { getSearchStudentConfig, getStudentColumns } from '@/views/classroom/tableData';
  import { useI18n } from '@/hooks/web/useI18n';
  import { studentListApi } from '@/api/student/student';

  const { t } = useI18n();
  const [registerTable, { getSelectRows, clearSelectedRowKeys }] = useTable({
    canResize: true,
    title: t('table.studentList'),
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
    useSearchForm: true,
    formConfig: getSearchStudentConfig(),
    rowSelection: {
      type: 'checkbox',
    },
    showSelectionBar: true,
    onColumnsChange: (data: ColumnChangeParam[]) => {
      console.log('ColumnsChanged', data);
    },
  });
  const emit = defineEmits(['selectStudents']);

  const selectTable = ref<InstanceType<typeof BasicTable> | undefined>();

  function getSelectStudents() {
    emit('selectStudents', getSelectRows());
    clearSelectedRowKeys();
  }
</script>
