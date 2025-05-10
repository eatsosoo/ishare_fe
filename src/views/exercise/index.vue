<template>
  <PageWrapper
    :title="t('form.gradingSearch.titleHomework')"
    :content="t('form.gradingSearch.contentHomework')"
  >
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="dashed" @click="activateModal('bank')">{{
          t('table.assignmentTable.assignFromBank')
        }}</a-button>
        <a-button type="dashed" @click="activateModal('assign')">{{
          t('table.assignmentTable.assignNormal')
        }}</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'assign_at'">
          {{ t(`table.exe${record.assign_at}`) }}
        </template>
        <template v-if="column.key === 'action'">
          <Icon
            icon="ant-design:copy-outlined"
            :size="18"
            class="cursor-pointer hover:border-red border-1 border-gray-200 p-1 rounded-md mr-1"
            @click="activateModal('copy', record.root_id)"
          />
          <Icon
            icon="ant-design:eye-twotone"
            :size="18"
            class="cursor-pointer hover:border-red border-1 border-gray-200 p-1 rounded-md mr-1"
            @click="activateModal('preview', record.root_id)"
          />
          <Icon
            icon="ant-design:delete-outlined"
            :size="18"
            class="cursor-pointer hover:border-red border-1 border-gray-200 p-1 rounded-md"
            @click="deleteItem(record.root_id)"
          />
        </template>
      </template>
    </BasicTable>
    <AssignHomeworkModal @register="registerAssignModal" @success="handleOk" />

    <AssignByBankModal @register="registerBankModal" @success="handleOk" />

    <CopyHomeworkModal
      @register="registerCopyModal"
      :homework-id="homeworkId"
      :class-list="classOptions"
      @success="handleOk"
    />

    <PreviewModal @register="registerPreviewModal" :exercise-id="homeworkId" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { PageWrapper } from '@/components/Page';
  import { useI18n } from '@/hooks/web/useI18n';
  import { BasicTable, useTable } from '@/components/Table';
  import { assignmentListApi } from '@/api/teacher/teacher';
  import { getAssignmentColumns, getAssignmentListConfig } from '@/views/classroom/tableData';
  import { useModal } from '@/components/Modal';
  import AssignHomeworkModal from './AssignHomeworkModal.vue';
  import { h, ref } from 'vue';
  import { ClassListItem } from '@/api/class/classModel';
  import Icon from '@/components/Icon/Icon.vue';
  import CopyHomeworkModal from './CopyHomeworkModal.vue';
  import { deleteExercise } from '@/api/exercise/exercise';
  import { useMessage } from '@/hooks/web/useMessage';
  import AssignByBankModal from './AssignByBankModal.vue';
  import PreviewModal from './PreviewModal.vue';

  const { t } = useI18n();
  const [registerTable, { reload }] = useTable({
    title: t('routes.page.assignmentList'),
    api: assignmentListApi('homework'),
    columns: getAssignmentColumns(),
    useSearchForm: true,
    formConfig: getAssignmentListConfig(),
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
  const [registerAssignModal, { openModal: openModal, closeModal }] = useModal();
  const [registerCopyModal, { openModal: openCopyModal, closeModal: closeCopyModal }] = useModal();
  const [registerBankModal, { openModal: openBankModal, closeModal: closeBankModal }] = useModal();
  const [registerPreviewModal, { openModal: openPreviewModal, closeModal: closePreviewModal }] =
    useModal();

  const { createConfirm } = useMessage();

  const classOptions = ref<ClassListItem[]>([]);
  const homeworkId = ref<number | null>(null);

  function handleOk() {
    closeModal();
    closeCopyModal();
    closeBankModal();
    closePreviewModal();
    reload();
  }

  function activateModal(type: 'assign' | 'copy' | 'bank' | 'preview', id = null) {
    // if (classOptions.value.length === 0) {
    //   fetchClasses();
    // }

    homeworkId.value = id;

    if (type === 'assign') {
      openModal();
    } else if (type === 'bank') {
      openBankModal();
    } else if (type === 'preview') {
      openPreviewModal();
    } else if (type === 'copy') {
      openCopyModal();
    }
  }

  function deleteItem(id: number) {
    createConfirm({
      iconType: 'warning',
      title: () => h('span', t('sys.app.logoutTip')),
      content: () => h('span', t('common.warning.deleteExercise')),
      onOk: async () => {
        try {
          const res = await deleteExercise(id);
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
