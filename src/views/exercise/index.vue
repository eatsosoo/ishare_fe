<template>
  <div>
    <BasicTable @register="registerTable">
      <template #form-custom> custom-slot </template>
      <template #toolbar>
        <a-button type="primary" @click="openAddModal">{{
          t('table.exerciseTable.createAction')
        }}</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-button
            size="small"
            preIcon="ant-design:home-outlined"
            class="mr-2"
            @click="activateEditorModal(record as ExamListItem)"
          />
          <a-button
            size="small"
            preIcon="ant-design:delete-outlined"
            @click="examDeleteApi(record.id)"
          />
        </template>
      </template>
    </BasicTable>

    <AddExamModal @register="registerAddModal" @success="handleSuccessModal" />
    <EditorHomeworkModal @register="registerEditorModal" :exam-id="examId" :title="titleEditor" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable } from '@/components/Table';
  import { getExamListConfig, getTestColumns } from '@/views/classroom/tableData';
  import { useI18n } from '@/hooks/web/useI18n';
  import { examDeleteApi, examListApi } from '@/api/exam/exam';
  import { useModal } from '@/components/Modal';
  import AddExamModal from '@/views/test/AddExamModal.vue';
  import { ref } from 'vue';
  import { ExamListItem } from '@/api/exam/examModel';
  import EditorHomeworkModal from './EditorHomeworkModal.vue';

  const { t } = useI18n();
  const [registerTable, { reload }] = useTable({
    title: t('routes.page.classroomList'),
    api: examListApi(),
    columns: getTestColumns(),
    useSearchForm: true,
    formConfig: getExamListConfig(),
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
  const examId = ref<number | undefined>(undefined);
  const titleEditor = ref('');

  const handleSuccessModal = () => {
    reload();
    closeModal();
  };

  const activateEditorModal = (record: ExamListItem) => {
    examId.value = record.id;
    titleEditor.value = record.title;
    openEditorModal();
  };

  const [registerAddModal, { openModal: openAddModal, closeModal }] = useModal();
  const [registerEditorModal, { openModal: openEditorModal }] = useModal();
</script>
