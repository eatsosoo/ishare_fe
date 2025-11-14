<template>
  <BasicModal
    v-bind="$attrs"
    :title="t('form.assignFromBank')"
    default-fullscreen
    :can-fullscreen="false"
    :loading="loading"
    @ok="submit"
    @cancel="reset"
  >
    <div class="border-1 border-gray-200 rounded-lg p-1 mx-2">
      <CollapseContainer :title="t('common.basicInformation')">
        <BasicForm @register="registerBasicForm" class="mt-6" />
      </CollapseContainer>
    </div>

    <div class="border-1 border-gray-200 rounded-lg p-1 mx-2 mt-4">
      <SelectClass @select="attendanceTarget = $event" ref="selectClassRef" />
    </div>

    <div class="border-1 border-gray-200 rounded-lg p-1 mx-2 mt-4 mb-8">
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
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal } from '@/components/Modal';
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
  import { getBankColumns, getBankListConfig } from '../classroom/tableData';
  import Icon from '@/components/Icon/Icon.vue';
  import SelectClass from './SelectClass.vue';

  const emit = defineEmits(['success']);

  const { t } = useI18n();
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

  const { createErrorModal, createSuccessModal } = useMessage();
  const prefixCls = useDesign('assign-homework');

  const selectClassRef = ref();
  const loading = ref(false);
  const examBankSelected = ref<any | null>(null);
  const attendanceTarget = ref({
    class_id: 0,
    shift_id: 0,
    study_date: '',
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

  function reset() {
    resetFields();
    examBankSelected.value = null;
    attendanceTarget.value = {
      class_id: 0,
      shift_id: 0,
      study_date: '',
    };
    selectClassRef.value?.reset();
  }
</script>
