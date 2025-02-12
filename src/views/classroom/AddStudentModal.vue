<template>
  <BasicModal
    v-bind="$attrs"
    title="Modal Title"
    width="1100px"
    :can-fullscreen="false"
    :loading="props.loading"
    @ok="getSelectStudents"
  >
    <BasicTable @register="registerTable" ref="selectTable" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal } from '@/components/Modal';
  import { BasicTable, useTable } from '@/components/Table';
  import { getSearchStudentConfig, getStudentColumns } from '@/views/classroom/tableData';
  import { useI18n } from '@/hooks/web/useI18n';
  import { getStudentsOfClassApi } from '@/api/class/class';

  const props = defineProps({
    loading: {
      type: Boolean,
      default: false,
    },
  });

  const { t } = useI18n();
  const [registerTable, { getSelectRows, clearSelectedRowKeys }] = useTable({
    canResize: true,
    title: t('table.studentList'),
    titleHelpMessage: t('table.addStudentToClass'),
    api: getStudentsOfClassApi(),
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
  });
  const emit = defineEmits(['selectStudents']);

  const selectTable = ref<InstanceType<typeof BasicTable> | undefined>();

  function getSelectStudents() {
    const rows = getSelectRows();
    const ids = rows.map((row) => {
      row.id;
    });
    emit('selectStudents', ids);
    clearSelectedRowKeys();
  }
</script>
