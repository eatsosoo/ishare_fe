<template>
  <PageWrapper
    :title="t('form.gradingSearch.titleHomework')"
    :content="t('form.gradingSearch.contentHomework')"
  >
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="dashed" @click="activateModal('assign')">{{
          t('table.assignmentTable.assign')
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
            class="cursor-pointer hover:border-red border-1 border-gray-200 p-1 rounded-md"
            @click="activateModal('copy', record.id)"
          />
        </template>
      </template>
    </BasicTable>
    <AssignHomeworkModal
      @register="registerAssignModal"
      :class-list="classOptions"
      @success="handleOk"
    />
    <CopyHomeworkModal
      @register="registerCopyModal"
      :homework-id="homeworkId"
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
  import Icon from '@/components/Icon/Icon.vue';
  import CopyHomeworkModal from './CopyHomeworkModal.vue';

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

  const classOptions = ref<ClassListItem[]>([]);
  const homeworkId = ref<number | null>(null);

  function handleOk() {
    closeModal();
    closeCopyModal();
    reload();
  }

  function activateModal(type: 'assign' | 'copy', id = null) {
    if (classOptions.value.length === 0) {
      fetchClasses();
    }

    homeworkId.value = id;

    if (type === 'assign') {
      openModal();
    } else {
      openCopyModal();
    }
  }

  async function fetchClasses() {
    const res = await classOptionsApi();
    classOptions.value = res.items;
  }
</script>
