<template>
  <BasicModal v-bind="$attrs" title="Modal Title" width="1100px" @fullscreen="onFullscreen">
    <CollapseContainer :title="t('table.search')" class="border">
      <BasicForm @register="registerSearchForm" @submit="handleSearchFormSubmit" />
    </CollapseContainer>
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
  import { BasicForm, FormSchema, useForm } from '@/components/Form';
  import { CollapseContainer } from '@/components/Container';
  import { useMessage } from '@/hooks/web/useMessage';

  const { t } = useI18n();
  const [registerTable] = useTable({
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

  const schemas: FormSchema[] = [
    {
      field: 'name',
      component: 'Input',
      label: t('table.studentName'),
      colProps: {
        span: 8,
      },
      required: true,
    },
    {
      field: 'phone',
      component: 'Input',
      label: t('table.phone'),
      colProps: {
        span: 8,
      },
      required: true,
    },
  ];

  const { createMessage } = useMessage();
  const [registerSearchForm] = useForm({
    labelWidth: 120,
    schemas,
    actionColOptions: {
      span: 24,
    },
  });

  function handleSearchFormSubmit(values: any) {
    createMessage.success('click search,values:' + JSON.stringify(values));
  }
</script>
