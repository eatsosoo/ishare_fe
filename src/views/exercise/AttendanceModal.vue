<template>
  <BasicModal
    v-bind="$attrs"
    :title="t('form.assignFromBank')"
    :can-fullscreen="false"
    :loading="loading"
    :width="600"
    @ok="submit"
  >
    <BasicForm @register="registerBasicForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ShiftItem } from '@/api/class/classModel';
  import { studyDateListApi } from '@/api/exercise/exercise';
  import { FormSchema, useForm } from '@/components/Form';
  import BasicForm from '@/components/Form/src/BasicForm.vue';
  import { BasicModal } from '@/components/Modal';
  import { useI18n } from '@/hooks/web/useI18n';
  import { ref, watch } from 'vue';

  const props = defineProps({
    classId: {
      type: Number,
      required: true,
    },
    shifts: {
      type: Array as PropType<ShiftItem[]>,
      default: () => [],
    },
  });

  const emit = defineEmits(['submit']);

  const { t } = useI18n();
  const loading = ref(false);
  const formData: FormSchema[] = [
    {
      field: 'shift_id',
      component: 'Select',
      label: t('form.shift'),
      componentProps: {
        options: props.shifts.map((shift) => ({ label: shift.title, value: shift.id })),
      },
      rules: [{ required: true }],
      colProps: {
        span: 24,
      },
    },
    {
      field: 'study_date',
      component: 'Select',
      label: t('form.studyDate'),
      componentProps: {
        options: [],
      },
      rules: [{ required: true }],
      colProps: {
        span: 24,
      },
    },
  ];

  const [registerBasicForm, { validate, resetFields, updateSchema }] = useForm({
    labelWidth: 120,
    schemas: formData,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });

  async function submit() {
    const [values] = await Promise.all([validate()]);

    emit('submit', values);
    resetFields();
  }

  watch(
    () => props.classId,
    async (val) => {
      if (val) {
        const res = await studyDateListApi(val);
        const studyDateList = res.items || [];

        updateSchema([
          {
            field: 'shift_id',
            componentProps: {
              options: props.shifts.map((shift) => ({ label: shift.title, value: shift.id })),
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
    },
  );
</script>
