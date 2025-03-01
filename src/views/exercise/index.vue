<template>
  <PageWrapper
    :title="t('form.gradingSearch.titleHomework')"
    :content="t('form.gradingSearch.contentHomework')"
  >
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="dashed" @click="activateModal">{{
          t('table.assignmentTable.assign')
        }}</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'type'">
          {{ t(`table.exe${record.type}`) }}
        </template>
      </template>
    </BasicTable>
    <AssignHomeworkModal
      @register="registerAssignModal"
      :class-list="classOptions"
      @success="handleOk"
    />
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
  import { classOptionsApi } from '@/api/class/class';
  import { ref } from 'vue';
  import { ClassListItem } from '@/api/class/classModel';

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
    // actionColumn: {
    //   title: t('table.action'),
    //   dataIndex: 'action',
    // },
  });
  const [registerAssignModal, { openModal: openModal, closeModal }] = useModal();

  const classOptions = ref<ClassListItem[]>([]);

  function handleOk() {
    closeModal();
    reload();
  }

  function activateModal() {
    fetchClasses();
    openModal();
  }

  async function fetchClasses() {
    const res = await classOptionsApi();
    classOptions.value = res.items;
  }
</script>
