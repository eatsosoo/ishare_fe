<template>
  <div>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="createActions(record)" />
        </template>
      </template>
    </BasicTable>
    <a-button block class="mt-5" type="dashed" @click="openAddModal">
      {{ t('form.addStudentToClass') }}
    </a-button>

    <AddStudentModal
      :title="t('form.addStudentToClass')"
      @register="registerAddModal"
      @select-students="handleSelectStudents"
    />
  </div>
</template>
<script lang="ts" setup>
  import { StudentListItem } from '@/api/student/studentModel';
  import { useModal } from '@/components/Modal';
  import {
    BasicTable,
    useTable,
    TableAction,
    BasicColumn,
    ActionItem,
    EditRecordRow,
  } from '@/components/Table';
  import { useI18n } from '@/hooks/web/useI18n';
  import AddStudentModal from '@/views/classroom/AddStudentModal.vue';

  const { t } = useI18n();
  const [registerAddModal, { openModal: openAddModal }] = useModal();
  const columns: BasicColumn[] = [
    {
      title: t('table.studentName'),
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: t('table.phone'),
      dataIndex: 'phone',
      align: 'left',
    },
    {
      title: t('table.email'),
      dataIndex: 'email',
      align: 'left',
    },
  ];
  const emit = defineEmits(['selectStudents']);

  const data: StudentListItem[] = [];
  const [registerTable, { getDataSource }] = useTable({
    columns: columns,
    showIndexColumn: true,
    dataSource: data,
    actionColumn: {
      width: 160,
      title: t('table.action'),
      dataIndex: 'action',
    },
    scroll: { y: '100%' },
    pagination: false,
  });
  // Expose getDataSource for parent components to use
  defineExpose({ getDataSource });

  function handleDelete(record: EditRecordRow) {
    const data = getDataSource();
    const index = data.findIndex((item) => item.key === record.key);
    data.splice(index, 1);
    emit('selectStudents', data);
  }

  function handleSelectStudents(students: StudentListItem[]) {
    const data = getDataSource();
    students.forEach((student) => {
      if (data.some((item) => item.id === student.id)) {
        return;
      }
      data.push({
        ...student,
      });
    });
    emit('selectStudents', data);
  }

  function createActions(record: EditRecordRow): ActionItem[] {
    return [
      {
        label: t('table.delete'),
        onClick: handleDelete.bind(null, record),
      },
    ];
  }
</script>
