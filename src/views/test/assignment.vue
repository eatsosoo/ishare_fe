<template>
  <PageWrapper
    :title="t('form.gradingSearch.titleExam')"
    :content="t('form.gradingSearch.contentExam')"
  >
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="openModal">{{
          t('form.gradingSearch.titleExam')
        }}</a-button>
      </template>
    </BasicTable>
    <AssignmentModal @register="registerAssignModal" @success="handleOk" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { PageWrapper } from '@/components/Page';
  import { useI18n } from '@/hooks/web/useI18n';
  import { BasicTable, useTable } from '@/components/Table';
  import AssignmentModal from '@/views/test/AssignmentModal.vue';
  import { assignmentListApi } from '@/api/teacher/teacher';
  import {
    getAssignmentExamColumns,
    getAssignmentExamListConfig,
  } from '@/views/classroom/tableData';
  import { useModal } from '@/components/Modal';

  const { t } = useI18n();
  const [registerTable, { reload }] = useTable({
    title: t('routes.page.assignmentList'),
    api: assignmentListApi('exam'),
    columns: getAssignmentExamColumns(),
    useSearchForm: true,
    formConfig: getAssignmentExamListConfig(),
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

  function handleOk() {
    closeModal();
    reload();
  }
</script>
