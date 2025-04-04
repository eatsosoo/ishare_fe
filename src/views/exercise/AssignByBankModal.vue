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
      <CollapseContainer :title="titleCollapseClass" :open-default="false">
        <BasicTable @register="registerClassTable">
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
      <CollapseContainer :title="titleCollapseBank" :open-default="false">
        <BasicTable @register="registerTable">
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
      @submit="closeModal"
    />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal, useModal } from '@/components/Modal';
  import { computed, ref, watch } from 'vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useDesign } from '@/hooks/web/useDesign';
  import { assignByBankSchemas } from '../classroom/data';
  import { useForm, BasicForm } from '@/components/Form';
  import { assignExerciseByBank } from '@/api/exercise/exercise';
  import { ClassListItem } from '@/api/class/classModel';
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

  const props = defineProps({
    classList: {
      type: Array as PropType<ClassListItem[]>,
      default: () => [],
    },
  });

  const emit = defineEmits(['success']);

  const { t } = useI18n();
  const [registerAttendanceModal, { openModal: openModal, closeModal }] = useModal();
  const [registerBasicForm, { validate, resetFields, updateSchema }] = useForm({
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

  const titleCollapseClass = computed(() => {
    const text = t('form.selectClass');
    if (classSelected.value) {
      const { title } = classSelected.value;
      return `${text}: ${title}`;
    }
    return `${text}: ${t('form.notSelect')}`;
  });

  const titleCollapseBank = computed(() => {
    const text = t('form.selectTestBank');
    if (examBankSelected.value) {
      const { book_name, skill, homework_name } = examBankSelected.value;
      return `${text}: ${book_name} - ${skill} - [${homework_name}]`;
    }
    return `${text}: ${t('form.notSelect')}`;
  });

  async function submit() {
    try {
      const [values] = await Promise.all([validate()]);
      const { class_id, shift_id, date, assign_at, study_date, title } = values;

      if (!examBankSelected.value) {
        createErrorModal({
          title: t('form.assignFromBank'),
          content: t('form.selectTestBank'),
        });
        return;
      }

      const { exam_bank_id } = examBankSelected.value;

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
        resetFields();
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
    openModal();
  }

  watch(
    () => props.classList,
    (newVal) => {
      const options = newVal.map((val) => ({ label: val.title, value: val.id }));
      console.log('op', options);
      updateSchema([
        {
          field: 'class_id',
          componentProps: { options },
        },
      ]);
    },
  );
</script>
