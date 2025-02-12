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
        <template v-if="column.key === 'action'">
          <a-button
            size="small"
            preIcon="ant-design:home-outlined"
            @click="activateHomworkModal(record)"
          />
        </template>
      </template>
    </BasicTable>

    <EditorHomeworkModal
      :title="titleModal"
      :class-id="targetClass?.id"
      @register="registerHomeworkModal"
    />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable } from '@/components/Table';
  import { getClassColumns, getFormConfig } from '@/views/classroom/tableData';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useModal } from '@/components/Modal';
  import { computed, ref } from 'vue';
  import { classListApi } from '@/api/class/class';
  import { ClassListItem } from '@/api/class/classModel';
  import EditorHomeworkModal from './EditorHomeworkModal.vue';

  const { t } = useI18n();
  const [registerHomeworkModal, { openModal: openHomeworkModal }] = useModal();
  const [registerTable, { getForm }] = useTable({
    title: t('routes.page.classroomList'),
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

  const targetClass = ref<ClassListItem | null>(null);
  const titleModal = computed(() => {
    return targetClass.value
      ? `Class ${targetClass.value.title} - ${t('routes.page.assignHomework')}`
      : '';
  });

  function getFormValues() {
    console.log(getForm().getFieldsValue());
  }

  function activateHomworkModal(record: ClassListItem | any) {
    targetClass.value = record;
    openHomeworkModal();
  }
</script>
