<template>
  <div>
    <BasicTable @register="registerTable">
      <template #form-custom> custom-slot </template>
      <template #toolbar>
        <a-button type="primary" @click="openAddModal">{{
          t('table.examTable.createAction')
        }}</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-button size="small" preIcon="ant-design:edit-outlined" class="mr-2" />
          <a-button
            size="small"
            preIcon="ant-design:delete-outlined"
            @click="examDeleteApi(record.id)"
          />
        </template>
      </template>
    </BasicTable>

    <AddExamModal @register="registerAddModal" @success="handleSuccessModal" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable } from '@/components/Table';
  import { getFormConfig, getTestColumns } from '@/views/classroom/tableData';
  import { useI18n } from '@/hooks/web/useI18n';
  import { examDeleteApi, examListApi } from '@/api/exam/exam';
  import { useModal } from '@/components/Modal';
  import AddExamModal from './AddExamModal.vue';

  const { t } = useI18n();
  const [registerTable, { reload }] = useTable({
    title: t('routes.page.classroomList'),
    api: examListApi(),
    columns: getTestColumns(),
    useSearchForm: true,
    formConfig: getFormConfig(),
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

  const handleSuccessModal = () => {
    reload();
    closeModal();
  };

  const [registerAddModal, { openModal: openAddModal, closeModal }] = useModal();
</script>
