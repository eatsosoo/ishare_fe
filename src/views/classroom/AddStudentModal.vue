<template>
  <BasicModal
    v-bind="$attrs"
    title="Modal Title"
    width="1100px"
    @register="registerModal"
    @fullscreen="onFullscreen"
    @ok="getSelectStudents"
  >
    <CollapseContainer :title="t('table.search')" class="search-student-form">
      <BasicForm @register="registerSearchForm" @submit="handleSearchFormSubmit" />
    </CollapseContainer>
    <BasicTable @register="registerTable" ref="selectTable" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, nextTick } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { BasicTable, ColumnChangeParam, useTable } from '@/components/Table';
  import { getStudentColumns } from '@/views/classroom/tableData';
  import { studentListApi } from '@/api/demo/table';
  import { useI18n } from '@/hooks/web/useI18n';
  import { BasicForm, FormSchema, useForm } from '@/components/Form';
  import { CollapseContainer } from '@/components/Container';
  import { useMessage } from '@/hooks/web/useMessage';

  const { t } = useI18n();
  const [registerModal, { closeModal }] = useModalInner();
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
    },
    {
      field: 'phone',
      component: 'Input',
      label: t('table.phone'),
      colProps: {
        span: 8,
      },
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

  function getSelectStudents() {
    emit('selectStudents', getSelectRows());
    clearSelectedRowKeys();
    closeModal();
  }
</script>
<style lang="less" scoped>
  .search-student-form {
    margin: 0 10px 10px;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    background-color: #fff;
    box-shadow:
      rgb(50 50 93 / 25%) 0 2px 5px -1px,
      rgb(0 0 0 / 30%) 0 1px 3px -1px;
  }
</style>
