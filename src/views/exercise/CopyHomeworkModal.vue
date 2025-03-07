<template>
  <BasicModal v-bind="$attrs" :title="t('form.copyHomework')" :loading="loading" @ok="submit">
    <BasicForm @register="registerForm" @field-value-change="handleFormChange" class="mt-6" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal } from '@/components/Modal';
  import { useI18n } from '@/hooks/web/useI18n';
  import { ref, watch } from 'vue';
  import { copyHomeworkFormSchemas } from '../classroom/data';
  import { copyExercise, studyDateListApi } from '@/api/exercise/exercise';
  import { BasicForm, useForm } from '@/components/Form';
  import { ClassListItem } from '@/api/class/classModel';
  import { useMessage } from '@/hooks/web/useMessage';
  import { CopyExerciseParams } from '@/api/exercise/exerciseModel';
  import { getLeftValue } from '@/utils/stringUtils';

  const props = defineProps({
    homeworkId: {
      type: Number,
      default: null,
    },
    classList: {
      type: Array as PropType<ClassListItem[]>,
      default: () => [],
    },
  });

  const emit = defineEmits(['success']);
  const { t } = useI18n();

  const loading = ref(false);

  const { createErrorModal, createSuccessModal } = useMessage();
  const [registerForm, { validate, resetFields, updateSchema }] = useForm({
    labelWidth: 120,
    schemas: copyHomeworkFormSchemas,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });

  async function handleFormChange(key, value) {
    if (key === 'class_id') {
      const shifts = value
        ? props.classList.find((cls: ClassListItem) => cls.id === value)?.shifts || []
        : [];

      const res = await studyDateListApi(value);
      const studyDateList = res.items || [];

      updateSchema([
        {
          field: 'shift_id',
          componentProps: {
            options: shifts.map((shift) => ({ label: shift.title, value: shift.id })),
          },
        },
        {
          field: 'study_date',
          componentProps: {
            options: studyDateList.map((date) => ({ label: date, value: date })),
          },
        },
      ]);
    }
  }

  const submit = async () => {
    try {
      const values = await validate();
      const { book_name, homework_name, deadline, shift_id, study_date, class_id } = values;
      const submitForm: CopyExerciseParams = {
        id: props.homeworkId,
        book_name,
        homework_name,
        deadline: getLeftValue(deadline),
        subject: 'copy subject',
        assignments: {
          class_id,
          shift_id,
          study_date,
          title: 'copy assignment title',
        },
      };

      loading.value = true;
      const res = await copyExercise(submitForm);
      if (res && res.items) {
        createSuccessModal({
          title: t('form.assignHomework'),
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
      });
    } finally {
      loading.value = false;
    }
  };

  watch(
    () => props.classList,
    (newVal) => {
      const options = newVal.map((val) => ({ label: val.title, value: val.id }));
      console.log('op', options);
      updateSchema({
        field: 'class_id',
        componentProps: { options },
      });
    },
  );
</script>
