<template>
  <BasicModal
    v-bind="$attrs"
    :title="t('form.exam.title')"
    width="1000px"
    :can-fullscreen="false"
    :loading="loading"
    @ok="handleSubmit"
    @cancel="resetFields"
  >
    <BasicForm @register="registerForm" ref="formRef" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal } from '@/components/Modal';
  import { BasicForm, useForm } from '@/components/Form';
  import { assignClass } from '@/views/classroom/data';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useDesign } from '@/hooks/web/useDesign';
  import { AssignClassToTeacher } from '@/api/teacher/teacherModel';
  import { assignClassApi } from '@/api/teacher/teacher';

  const { t } = useI18n();
  const { createErrorModal, createSuccessModal } = useMessage();
  const [registerForm, { validate, resetFields }] = useForm({
    labelWidth: 120,
    schemas: assignClass,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });
  const { prefixCls } = useDesign('register');

  const loading = ref(false);
  const formRef = ref<InstanceType<typeof BasicForm> | undefined>();

  const emit = defineEmits(['success']);

  async function handleSubmit() {
    try {
      const { class_id, user_id } = await validate();
      const submitForm: AssignClassToTeacher = {
        user_id,
        classes: [{ id: class_id }],
      };
      loading.value = true;

      const result = await assignClassApi(submitForm);
      if (result) {
        createSuccessModal({
          title: t('form.gradingSearch.titleExam'),
          content: t('common.createSuccessfully'),
          getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
        });
        resetFields();
        emit('success');
      }
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
