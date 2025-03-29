<template>
  <PageWrapper
    :title="t('routes.page.testIndexTitle')"
    :content="t('routes.page.testIndexContent')"
  >
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
            @click="activateEditorModal(record as ExamListItem)"
          />
          <Icon
            icon="ant-design:delete-outlined"
            :size="18"
            class="cursor-pointer hover:border-red border-1 border-gray-200 p-1 rounded-md"
            @click="deleteItem(record.id)"
          />
        </template>
      </template>
    </BasicTable>

    <CreateExamModal @register="registerAddModal" @success="handleSuccessModal" />
    <EditorExamModal @register="registerEditorModal" :exam-id="examId" :title="titleEditor" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable } from '@/components/Table';
  import { getExamListConfig, getTestColumns } from '@/views/classroom/tableData';
  import { useI18n } from '@/hooks/web/useI18n';
  import { examDeleteApi, examListApi } from '@/api/exam/exam';
  import { useModal } from '@/components/Modal';
  import CreateExamModal from '@/views/test/CreateExamModal.vue';
  import EditorExamModal from '@/views/test/EditorExamModal.vue';
  import { h, ref } from 'vue';
  import { ExamListItem } from '@/api/exam/examModel';
  import Icon from '@/components/Icon/Icon.vue';
  import PageWrapper from '@/components/Page/src/PageWrapper.vue';
  import { useMessage } from '@/hooks/web/useMessage';

  const { t } = useI18n();
  const [registerTable, { reload }] = useTable({
    title: t('routes.page.examList'),
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
  const { createConfirm } = useMessage();

  function deleteItem(id: number) {
    createConfirm({
      iconType: 'warning',
      title: () => h('span', t('sys.app.logoutTip')),
      content: () => h('span', t('common.warning.deleteTest')),
      onOk: async () => {
        const res = await examDeleteApi(id);
        if (res && res.items) {
          reload();
        }
      },
    });
  }
</script>
