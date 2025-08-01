<template>
  <BasicModal
    v-bind="$attrs"
    :title="t('form.copyHomework')"
    :loading="loading"
    :default-fullscreen="true"
    @ok="submit"
  >
    <div class="shadow-lg rounded-lg p-1 mx-1 mb-4">
      <CollapseContainer :title="t('common.basicInformation')">
        <BasicForm @register="registerForm" @field-value-change="handleFormChange" class="mt-6" />
      </CollapseContainer>
    </div>

    <div class="shadow-lg rounded-lg p-1 mx-1">
      <SelectClass @select="attendanceTarget = $event" ref="selectClassRef" />
    </div>
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
  import { CollapseContainer } from '@/components/Container';
  import SelectClass from './SelectClass.vue';

  const props = defineProps({
    homeworkId: {
      type: [Number, null] as PropType<number | null>,
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
  const attendanceTarget = ref({
    class_id: 0,
    shift_id: 0,
    study_date: '',
  });
  const selectClassRef = ref();

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
      const { book_name, homework_name, deadline } = values;
      const { class_id, shift_id, study_date } = attendanceTarget.value;

      if (!class_id || !shift_id || !study_date) {
        createErrorModal({
          title: t('form.assignHomework'),
          content: t('form.selectClass'),
        });
        return;
      }

      if (!props.homeworkId) {
        createErrorModal({
          title: t('form.assignHomework'),
          content: t('common.error.notHaveID', { name: 'Homework' }),
        });
        return;
      }

      const submitForm: CopyExerciseParams = {
        id: props.homeworkId,
        book_name,
        homework_name,
        deadline: getLeftValue(deadline),
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
      });
    } finally {
      loading.value = false;
    }
  };

  function reset() {
    resetFields();
    attendanceTarget.value = {
      class_id: 0,
      shift_id: 0,
      study_date: '',
    };
    selectClassRef.value?.reset();
  }

  watch(
    () => props.classList,
    (newVal) => {
      const options = newVal.map((val) => ({ label: val.title, value: val.id }));
      updateSchema({
        field: 'class_id',
        componentProps: { options },
      });
    },
  );
</script>
