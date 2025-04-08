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
  import { createBookApi } from '../../api/exercise/exercise';
  import { CreateBookParams } from '@/api/exercise/exerciseModel';
  import { useMessage } from '@/hooks/web/useMessage';

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
      colProps: {
        span: 24,
      },
    },
  ];

  const { createSuccessModal, createErrorModal } = useMessage();
  const [registerBasicForm, { validate, resetFields }] = useForm({
    labelWidth: 120,
    schemas: formData,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });

  async function submit() {
    try {
      loading.value = true;
      const [values] = await Promise.all([validate()]);
      const { title, type, level, description } = values;
      const formData: CreateBookParams = {
        title,
        type,
        level,
        description,
      };
      const result = await createBookApi(formData);
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
      const apiMessage = error.response.data.message;
      createErrorModal({
        title: t('sys.api.errorTip'),
        content:
          apiMessage || (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
      });
    } finally {
      loading.value = false;
    }
  }
</script>
