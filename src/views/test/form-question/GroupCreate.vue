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
  import { questionTypeOps } from '../data';

  const groupQuestionSchemas: FormSchema[] = [
    {
      field: 'group_type',
      component: 'Select',
      label: 'Dạng câu hỏi',
      required: true,
      componentProps: {
        options: questionTypeOps,
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
