<template>
  <div>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'start_date'">
          {{ record.start_date.split(' ')[0] }}
        </template>
        <template v-if="column.key === 'action'">
          <div class="flex gap-2 justify-center">
            <Icon
              v-for="(action, index) in actions"
              :key="index"
              :size="18"
              :icon="action.icon"
              class="cursor-pointer hover:border-red border-1 border-gray-200 p-1 rounded-md"
              @click="activateModal(record, action.action)"
            />
          </div>
        </template>
      </template>
    </BasicTable>

    <DetailClassModal
      :title="titleModal"
      :class-id="targetClass?.id ?? 0"
      @register="registerViewModal"
    />
    <AddStudentModal
      :title="titleModal"
      :loading="addLoading"
      @register="registerAddModal"
      @select-students="handleAddMoreStudents"
    />
    <ImportStudentModal
      :title="titleModal"
      :class-id="targetClass?.id ?? 0"
      :class-key="targetClass?.key ?? ''"
      @register="registerImportModal"
      @success="closeImportModal"
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
  import { useMessage } from '@/hooks/web/useMessage';
  import { addStudentClassApi, classListApi } from '@/api/class/class';
  import { ClassAddStudentsParams, ClassListItem } from '@/api/class/classModel';
  import { useUserStore } from '@/store/modules/user';
  import Icon from '@/components/Icon/Icon.vue';
  import ImportStudentModal from './ImportStudentModal.vue';

  const { t } = useI18n();
  const useStore = useUserStore();
  const [registerViewModal, { openModal: openViewModal }] = useModal();
  const [registerAddModal, { openModal: openAddModal, closeModal }] = useModal();
  const [registerImportModal, { openModal: openImportModal, closeModal: closeImportModal }] =
    useModal();
  const [registerTable, { reload }] = useTable({
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

  const targetClass = ref<ClassListItem | null>(null);
  const addLoading = ref(false);

  const titleModal = computed(() => {
    return targetClass.value ? `${targetClass.value.title} - ${targetClass.value.teacher}` : '';
  });

  const actions = [
    {
      icon: 'ant-design:ordered-list-outlined',
      action: 'VIEW',
    },
    {
      icon: 'ant-design:user-add-outlined',
      action: 'ADD',
    },
    {
      icon: 'ant-design:import-outlined',
      action: 'IMPORT',
    },
  ];

  const { createSuccessModal, createErrorModal } = useMessage();

  function activateModal(record: ClassListItem | any, type: string) {
    useStore.setClassId(record.id);
    targetClass.value = record;
    if (type === 'VIEW') {
      openViewModal();
    } else if (type === 'ADD') {
      openAddModal();
    } else if (type === 'IMPORT') {
      openImportModal();
    }
  }

  async function handleAddMoreStudents(students: { id: number }[]) {
    try {
      if (!useStore.getClassId) {
        createErrorModal({
          title: t('sys.api.errorTip'),
          content: t('sys.exception.anErrorOccured'),
        });
        return;
      }
      addLoading.value = true;

      const formData: ClassAddStudentsParams = {
        class_id: useStore.getClassId,
        students: students.map((student) => ({ id: student.id })),
      };
      const result = await addStudentClassApi(formData);
      if (result) {
        createSuccessModal({
          title: t('layout.setting.operatingTitle'),
          content: t('table.addStudentToClassSuccess'),
        });
        closeModal();
        reload();
      }
    } catch (error) {
      const apiMessage = error.response.data.message;
      createErrorModal({
        title: t('sys.api.errorTip'),
        content:
          apiMessage || (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
      });
    } finally {
      addLoading.value = false;
    }
  }
</script>
