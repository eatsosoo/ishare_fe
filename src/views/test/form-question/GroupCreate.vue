<template>
  <BasicModal
    v-bind="$attrs"
    :title="'Tạo nhóm câu hỏi'"
    width="500px"
    :can-fullscreen="false"
    @ok="create"
    @cancel="resetFields"
  >
    <BasicForm @register="registerForm" ref="formRef" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal } from '@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '@/components/Form';
  import { useI18n } from '@/hooks/web/useI18n';
  import { GroupQuestionType } from '@/views/test/types/question';

  const { t } = useI18n();
  const options: GroupQuestionType[] = [
    {
      label: 'fill_in',
      value: 'fill_in',
    },
    {
      label: 'true_false_not_given',
      value: 'true_false_not_given',
    },
    {
      label: 'correct_letter',
      value: 'correct_letter',
    },
    {
      label: 'choice',
      value: 'choice',
    },
    {
      label: 'multiple_choice',
      value: 'multiple_choice',
    },
  ];
  const groupQuestionSchemas: FormSchema[] = [
    {
      field: 'group_type',
      component: 'Select',
      label: 'Dạng câu hỏi',
      required: true,
      componentProps: {
        options: options,
      },
      colProps: {
        offset: 1,
        span: 16,
      },
    },
    {
      field: 'total',
      label: 'Số lượng câu',
      component: 'InputNumber',
      componentProps: {
        defaultValue: 1,
      },
      required: true,
      colProps: {
        offset: 1,
      },
    },
  ];
  const [registerForm, { validate, resetFields }] = useForm({
    labelWidth: 120,
    schemas: groupQuestionSchemas,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });

  const formRef = ref<InstanceType<typeof BasicForm> | undefined>();

  const emit = defineEmits(['ok']);

  async function create() {
    const values = await validate();
    emit('ok', { ...values });
    resetFields;
  }
</script>
