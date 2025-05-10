<template>
  <PageWrapper :title="t('routes.page.practiceTitle')" :content="t('routes.page.practiceContent')">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="dashed" @click="openAddModal">{{
          t('table.examTable.createAction')
        }}</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <Icon
            icon="ant-design:edit-outlined"
            :size="18"
            class="cursor-pointer hover:border-red border-1 border-gray-200 p-1 rounded-md mr-1"
            @click="activateEditorModal(record as ExamListItem, 'editor')"
          />
          <Icon
            icon="ant-design:delete-outlined"
            :size="18"
            class="cursor-pointer hover:border-red border-1 border-gray-200 p-1 rounded-md mr-1"
            @click="deleteItem(record.id)"
          />
          <Icon
            icon="ant-design:file-excel-outlined"
            :size="18"
            class="cursor-pointer hover:border-red border-1 border-gray-200 p-1 rounded-md"
            @click="activateEditorModal(record as ExamListItem, 'excel')"
          />
        </template>
      </template>
    </BasicTable>

    <CreateExamModal
      @register="registerAddModal"
      @success="handleSuccessModal"
      is-published="publish"
    />

    <EditorExamModal @register="registerEditorModal" :exam-id="examId" :title="modalTitle" />

    <ExportScorePracticeModal
      @register="registerExportModal"
      :practice-id="examId"
      :title="modalTitle"
    />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable } from '@/components/Table';
  import { getExamListConfig, getTestColumns } from '@/views/classroom/tableData';
  import { useI18n } from '@/hooks/web/useI18n';
  import { examDeleteApi, practiceExamListApi } from '@/api/exam/exam';
  import { useModal } from '@/components/Modal';
  import CreateExamModal from '@/views/test/CreateExamModal.vue';
  import EditorExamModal from '@/views/test/EditorExamModal.vue';
  import { h, ref } from 'vue';
  import { ExamListItem } from '@/api/exam/examModel';
  import Icon from '@/components/Icon/Icon.vue';
  import PageWrapper from '@/components/Page/src/PageWrapper.vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import ExportScorePracticeModal from './ExportScorePracticeModal.vue';

  const { t } = useI18n();
  const [registerTable, { reload }] = useTable({
    title: t('routes.page.practiceTestList'),
    api: practiceExamListApi(),
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
  const modalTitle = ref('');

  const handleSuccessModal = () => {
    reload();
    closeModal();
  };

  const activateEditorModal = (record: ExamListItem, type: 'excel' | 'editor') => {
    examId.value = record.id;
    modalTitle.value = record.title;

    if (type === 'excel') {
      openExportModal();
    } else {
      openEditorModal();
    }
  };

  const [registerAddModal, { openModal: openAddModal, closeModal }] = useModal();
  const [registerEditorModal, { openModal: openEditorModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();

  const { createConfirm } = useMessage();

  function deleteItem(id: number) {
    createConfirm({
      iconType: 'warning',
      title: () => h('span', t('sys.app.logoutTip')),
      content: () => h('span', t('common.warning.deletePracticeTest')),
      onOk: async () => {
        try {
          const res = await examDeleteApi(id);
          if (res && res.items) {
            reload();
          }
        } catch (error) {
          console.error(error);
        }
      },
    });
  }
</script>
