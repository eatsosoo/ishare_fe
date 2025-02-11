<template>
  <div>
    <BasicTable @register="registerTable">
      <template #form-custom> custom-slot </template>
      <template #toolbar>
        <a-button type="primary" @click="getFormValues">{{ t('table.enterData') }}</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'start_date'">
          {{ record.start_date.split(' ')[0] }}
        </template>
        <template v-if="column.key === 'end_date'">
          {{ record.end_date.split(' ')[0] }}
        </template>
        <template v-if="column.key === 'status'">
          {{ setClassStatus(record.start_date, record.end_date) }}
        </template>
        <template v-if="column.key === 'action'">
          <Tooltip>
            <template #title>
              <div>{{ t('table.viewStudentList') }}</div>
            </template>
            <a-button
              size="small"
              preIcon="ant-design:ordered-list-outlined"
              class="mr-2"
              @click="activateModal(record, 'VIEW')"
            />
          </Tooltip>
          <Tooltip>
            <template #title>
              <div>{{ t('table.addStudentToClass') }}</div>
            </template>
            <a-button
              size="small"
              preIcon="ant-design:user-add-outlined"
              @click="activateModal(record, 'ADD')"
            />
          </Tooltip>
        </template>
      </template>
    </BasicTable>

    <DetailClassModal
      :title="titleModal"
      :class-id="targetValue?.id ?? 0"
      @register="registerViewModal"
    />
    <AddStudentModal
      :title="titleModal"
      @register="registerAddModal"
      @select-students="handleAddMoreStudents"
    />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable } from '@/components/Table';
  import { getClassColumns, getFormSearchClassConfig } from '@/views/classroom/tableData';
  import { useI18n } from '@/hooks/web/useI18n';
  import DetailClassModal from './DetailClassModal.vue';
  import { useModal } from '@/components/Modal';
  import { computed, ref } from 'vue';
  import AddStudentModal from '@/views/classroom/AddStudentModal.vue';
  import { Tooltip } from 'ant-design-vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import { classListApi } from '@/api/class/class';
  import { ClassListItem } from '@/api/class/classModel';
  import { useUserStore } from '@/store/modules/user';

  const { t } = useI18n();
  const [registerViewModal, { openModal: openViewModal }] = useModal();
  const [registerAddModal, { openModal: openAddModal }] = useModal();
  const [registerTable, { getForm }] = useTable({
    title: t('routes.page.classroomList'),
    api: classListApi(),
    columns: getClassColumns(),
    useSearchForm: true,
    formConfig: getFormSearchClassConfig(),
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

  const targetValue = ref<ClassListItem | null>(null);
  const titleModal = computed(() => {
    return targetValue.value ? `${targetValue.value.title} - ${targetValue.value.teacher}` : '';
  });

  const { createSuccessModal } = useMessage();

  function getFormValues() {
    console.log(getForm().getFieldsValue());
  }

  function activateModal(record: ClassListItem | any, type: 'ADD' | 'VIEW') {
    const useStore = useUserStore();
    useStore.setClassId(record.id);
    targetValue.value = record;
    if (type === 'VIEW') {
      openViewModal();
    } else {
      openAddModal();
    }
  }

  function handleAddMoreStudents() {
    console.log('Add more students');
    createSuccessModal({
      title: t('layout.setting.operatingTitle'),
      content: t('table.addStudentToClassSuccess'),
    });
  }

  function setClassStatus(startDate: string, endDate: string) {
    const currentDate = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (currentDate < start) {
      return t('form.newClassForm.pending');
    } else if (currentDate >= start && currentDate <= end) {
      return t('form.newClassForm.enable');
    } else {
      return t('form.newClassForm.finished');
    }
  }
</script>
