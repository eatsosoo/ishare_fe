<template>
  <BasicModal
    v-bind="$attrs"
    :title="t('form.assignFromBank')"
    default-fullscreen
    :can-fullscreen="false"
    :loading="loading"
    @ok="submit"
  >
    <div class="shadow-lg rounded-lg p-1 mx-1">
      <CollapseContainer :title="t('common.basicInformation')">
        <BasicForm @register="registerBasicForm" class="mt-6" />
      </CollapseContainer>
    </div>

    <div class="shadow-lg rounded-lg p-1 mx-1 mt-4">
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
    </div>

    <div class="shadow-lg rounded-lg p-1 mx-1 mt-4 mb-8">
      <CollapseContainer :open-default="false">
        <template #title>
          <div v-html="titleCollapseBank"></div>
        </template>
        <BasicTable @register="registerTable" :max-height="300">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <Icon
                icon="ant-design:select-outlined"
                :size="18"
                class="cursor-pointer hover:border-red border-1 border-gray-200 p-1 rounded-md mr-2"
                @click="examBankSelected = record"
              />
            </template>
          </template> </BasicTable
      ></CollapseContainer>
    </div>

    <AttendanceModal
      @register="registerAttendanceModal"
      :class-id="classSelected?.id ?? 0"
      :shifts="classSelected?.shifts ?? []"
      @submit="selectAttendance"
    />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal, useModal } from '@/components/Modal';
  import { computed, ref } from 'vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useDesign } from '@/hooks/web/useDesign';
  import { assignByBankSchemas } from '../classroom/data';
  import { useForm, BasicForm } from '@/components/Form';
  import { assignExerciseByBank } from '@/api/exercise/exercise';
  import { CollapseContainer } from '@/components/Container';
  import { getLeftValue } from '@/utils/stringUtils';
  import { BasicTable, useTable } from '@/components/Table';
  import { bankListApi } from '@/api/teacher/teacher';
  import {
    getBankColumns,
    getBankListConfig,
    getClassColumns,
    getFormSearchClassConfig,
  } from '../classroom/tableData';
  import Icon from '@/components/Icon/Icon.vue';
  import { classListApi } from '@/api/class/class';
  import AttendanceModal from './AttendanceModal.vue';

  const emit = defineEmits(['success']);

  const { t } = useI18n();
  const [registerAttendanceModal, { openModal: openModal, closeModal }] = useModal();
  const [registerBasicForm, { validate, resetFields }] = useForm({
    labelWidth: 120,
    schemas: assignByBankSchemas,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });

  const [registerTable] = useTable({
    title: t('routes.page.bankList'),
    api: bankListApi(),
    columns: getBankColumns(),
    useSearchForm: true,
    formConfig: getBankListConfig(),
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

  const { createErrorModal, createSuccessModal } = useMessage();
  const prefixCls = useDesign('assign-homework');

  const loading = ref(false);
  const examBankSelected = ref<any | null>(null);
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
      return `${text}: ${notSelectTag} - ${notSelectTag} - ${notSelectTag}`;
    }

    const { title, shifts } = classSelected.value;
    const { study_date, shift_id } = attendanceTarget.value;

    const studyDateText = study_date ? `[${study_date}]` : notSelectTag;
    const shiftTitle = shifts.find((item: any) => item.id === shift_id)?.title;
    const shiftTitleText = shiftTitle ? `[${shiftTitle}]` : notSelectTag;

    return `${text}: ${title} - ${studyDateText} - ${shiftTitleText}`;
  });

  const titleCollapseBank = computed(() => {
    const text = t('form.selectTestBank');
    if (examBankSelected.value) {
      const { book_name, skill, homework_name } = examBankSelected.value;
      return `${text}: ${book_name} - ${skill} - [${homework_name}]`;
    }
    return `${text}: <span class="text-red-500">${t('form.notSelect')}</span>`;
  });

  async function submit() {
    try {
      const [values] = await Promise.all([validate()]);
      const { date, assign_at, title } = values;
      const { class_id, shift_id, study_date } = attendanceTarget.value;

      if (!examBankSelected.value) {
        createErrorModal({
          title: t('form.assignFromBank'),
          content: t('form.selectTestBank'),
        });
        return;
      }

      if (!class_id || !shift_id || !study_date) {
        createErrorModal({
          title: t('form.assignFromBank'),
          content: t('form.selectClass'),
        });
        return;
      }

      const { id: exam_bank_id } = examBankSelected.value;

      const submitForm: any = {
        exam_bank_id,
        assign_at,
        assignments: {
          class_id,
          shift_id,
          study_date,
          title,
        },
        deadline: getLeftValue(date),
      };

      const result = await assignExerciseByBank(submitForm);
      if (result) {
        createSuccessModal({
          title: t('form.assignFromBank'),
          content: t('common.createSuccessfully'),
          // getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
        });
        reset();
        emit('success');
      }
    } catch (error) {
      if (error.errorFields) {
        return;
      }
      console.log(error);
      const apiMessage = error.response.data.message;
      createErrorModal({
        title: t('sys.api.errorTip'),
        content:
          apiMessage || (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
        getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
      });
    } finally {
      loading.value = false;
    }
  }

  function activate(record: any) {
    classSelected.value = record;
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

    closeModal();
  }

  function reset() {
    resetFields();
    classSelected.value = null;
    examBankSelected.value = null;
    attendanceTarget.value = {
      class_id: 0,
      shift_id: 0,
      study_date: '',
    };
  }
</script>
