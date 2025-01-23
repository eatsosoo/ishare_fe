<template>
  <div>
    <BasicTable @register="registerTable">
      <template #form-custom> custom-slot </template>
      <template #toolbar>
        <a-button type="primary" @click="getFormValues">{{ t('table.enterData') }}</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-button type="link" @click="activateModal(record)">{{ t('table.view') }}</a-button>
        </template>
      </template>
    </BasicTable>

    <ClassModal :title="titleModal" @register="registerModal" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable } from '@/components/Table';
  import { getClassColumns, getFormConfig } from '@/views/class-room/tableData';
  import { classListApi } from '@/api/demo/table';
  import { useI18n } from '@/hooks/web/useI18n';
  import ClassModal from './ClassModal.vue';
  import { useModal } from '@/components/Modal';
  import { ClassListItem } from '@/api/demo/model/tableModel';
  import { computed, ref } from 'vue';

  const { t } = useI18n();
  const [registerModal, { openModal: openClassModal }] = useModal();
  const [registerTable, { getForm }] = useTable({
    title: t('routes.page.classRoomList'),
    api: classListApi(),
    columns: getClassColumns(),
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

  const targetValue = ref<ClassListItem | null>(null);
  const titleModal = computed(() => {
    return targetValue.value ? `${targetValue.value.className} - ${targetValue.value.teacher}` : '';
  });

  function getFormValues() {
    console.log(getForm().getFieldsValue());
  }

  function activateModal(record: ClassListItem | any) {
    targetValue.value = record;
    openClassModal();
  }
</script>
