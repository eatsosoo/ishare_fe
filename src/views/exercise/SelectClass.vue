<template>
  <CollapseContainer :open-default="false">
    <template #title>
      <div v-html="titleCollapseClass"></div>
    </template>
    <BasicTable @register="registerClassTable" :max-height="300">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <Icon
            icon="ant-design:select-outlined"
            :size="18"
            class="cursor-pointer hover:border-red border-1 border-gray-200 p-1 rounded-md mr-2"
            @click="activate(record)"
          />
        </template>
      </template> </BasicTable
  ></CollapseContainer>

  <AttendanceModal
    @register="registerAttendanceModal"
    :class-id="classSelected?.id ?? 0"
    :shifts="classSelected?.shifts ?? []"
    @submit="selectAttendance"
  />
</template>

<script setup lang="ts">
  import { classListApi } from '@/api/class/class';
  import { BasicTable, useTable } from '@/components/Table';
  import { useI18n } from '@/hooks/web/useI18n';
  import { computed, ref } from 'vue';
  import { getClassColumns, getFormSearchClassConfig } from '../classroom/tableData';
  import { useModal } from '@/components/Modal';
  import AttendanceModal from './AttendanceModal.vue';
  import { CollapseContainer } from '@/components/Container';
  import Icon from '@/components/Icon/Icon.vue';

  const props = defineProps({
    extend: {
      type: Boolean,
      default: true,
    },
  });

  const { t } = useI18n();
  const emit = defineEmits(['select']);

  const classSelected = ref<any | null>(null);
  const attendanceTarget = ref({
    class_id: 0,
    shift_id: 0,
    study_date: '',
  });

  const titleCollapseClass = computed(() => {
    const text = t('form.selectClass');
    const notSelectTag = `<span class="text-red-500">${t('form.notSelect')}</span>`;

    if (!classSelected.value) {
      if (!props.extend) {
        return `${text}: ${notSelectTag}`;
      }
      return `${text}: ${notSelectTag} - ${notSelectTag} - ${notSelectTag}`;
    }

    const { title, shifts } = classSelected.value;
    const { study_date, shift_id } = attendanceTarget.value;

    const studyDateText = study_date ? `[${study_date}]` : notSelectTag;
    const shiftTitle = shifts.find((item: any) => item.id === shift_id)?.title;
    const shiftTitleText = shiftTitle ? `[${shiftTitle}]` : notSelectTag;

    if (!props.extend) {
      return `${text}: ${title}`;
    }
    return `${text}: ${title} - ${studyDateText} - ${shiftTitleText}`;
  });

  const [registerAttendanceModal, { openModal: openModal, closeModal }] = useModal();

  const [registerClassTable] = useTable({
    title: t('routes.page.classroomList'),
    api: classListApi(),
    columns: getClassColumns(),
    useSearchForm: true,
    formConfig: getFormSearchClassConfig(),
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    showIndexColumn: true,
    rowKey: 'id',
    showSelectionBar: false,
    actionColumn: {
      title: t('table.action'),
      dataIndex: 'action',
    },
  });

  function activate(record: any) {
    classSelected.value = record;

    if (!props.extend) {
      emit('select', record.id);
      return;
    }
    attendanceTarget.value = {
      class_id: record.id,
      shift_id: 0,
      study_date: '',
    };
    openModal();
  }

  function selectAttendance(val: { shift_id: number; study_date: string }) {
    attendanceTarget.value = {
      class_id: classSelected.value.id,
      shift_id: val.shift_id,
      study_date: val.study_date,
    };
    emit('select', attendanceTarget.value);
    closeModal();
  }

  function reset() {
    classSelected.value = null;
    attendanceTarget.value = {
      class_id: 0,
      shift_id: 0,
      study_date: '',
    };
  }

  defineExpose({
    reset,
  });
</script>
