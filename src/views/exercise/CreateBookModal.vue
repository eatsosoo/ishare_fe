<template>
  <BasicModal
    v-bind="$attrs"
    :title="t('table.createBook')"
    :can-fullscreen="false"
    :loading="loading"
    :width="600"
    @ok="submit"
  >
    <BasicForm @register="registerBasicForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { FormSchema, useForm } from '@/components/Form';
  import BasicForm from '@/components/Form/src/BasicForm.vue';
  import { BasicModal } from '@/components/Modal';
  import { useI18n } from '@/hooks/web/useI18n';
  import { ref } from 'vue';

  const emit = defineEmits(['success']);

  const { t } = useI18n();
  const loading = ref(false);
  const formData: FormSchema[] = [
    {
      field: 'title',
      component: 'Input',
      label: t('table.bookName'),
      rules: [{ required: true }],
      colProps: {
        span: 24,
      },
    },
    {
      field: 'type',
      component: 'Select',
      componentProps: {
        options: [
          { label: t('table.bookType1'), value: 'Sách trên lớp' },
          { label: t('table.bookType2'), value: 'Sách bổ trợ (bài tập về nhà)' },
          { label: t('table.bookType3'), value: 'Bài tập về nhà' },
        ],
      },
      label: t('table.bookType'),
      rules: [{ required: true }],
      colProps: {
        span: 24,
      },
    },
    {
      field: 'level',
      component: 'InputNumber',
      label: t('table.bookLevel'),
      componentProps: {
        min: 0,
        max: 10,
        defaultValue: 0,
      },
      rules: [{ required: true }],
      colProps: {
        span: 24,
      },
    },
    {
      field: 'description',
      component: 'Input',
      label: t('table.bookDescription'),
      rules: [{ required: true }],
      colProps: {
        span: 24,
      },
    },
  ];

  const [registerBasicForm, { validate, resetFields }] = useForm({
    labelWidth: 120,
    schemas: formData,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });

  async function submit() {
    const [values] = await Promise.all([validate()]);

    emit('success', values);
    resetFields();
  }
</script>
