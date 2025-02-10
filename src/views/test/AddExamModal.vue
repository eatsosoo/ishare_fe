<template>
  <BasicModal
    v-bind="$attrs"
    :title="t('form.exam.title')"
    width="500px"
    :can-fullscreen="false"
    :loading="loading"
    @ok="save"
    @cancel="resetFields"
  >
    <BasicForm @register="registerForm" ref="formRef" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal } from '@/components/Modal';
  import { BasicForm, useForm } from '@/components/Form';
  import { createExamSchemas } from '@/views/classroom/data';
  import { useI18n } from '@/hooks/web/useI18n';
  import { ExamAddForm } from '@/api/exam/examModel';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useDesign } from '@/hooks/web/useDesign';
  import { examCreateApi } from '@/api/exam/exam';

  const { t } = useI18n();
  const { createErrorModal, createSuccessModal } = useMessage();
  const [registerForm, { validate, resetFields }] = useForm({
    labelWidth: 120,
    schemas: createExamSchemas,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });
  const { prefixCls } = useDesign('register');

  const loading = ref(false);
  const formRef = ref<InstanceType<typeof BasicForm> | undefined>();

  const emit = defineEmits(['success']);

  async function save() {
    if (!formRef.value) {
      createErrorModal({
        title: t('sys.api.errorTip'),
        content: t('sys.api.errorMessage'),
      });
      return;
    }

    try {
      const values = await validate();
      const submitForm: ExamAddForm = {
        title: values.title,
        deadline: values.deadline,
      };
      loading.value = true;

      const newExam = await examCreateApi(submitForm);
      if (newExam) {
        createSuccessModal({
          title: t('form.newClassForm.title'),
          content: t('common.createSuccessfully'),
          getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
        });
        resetFields();
      }
      emit('success');
    } catch (error) {
      if (error.errorFields) return;
      const apiMessage = error.response?.data.message;
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
</script>
