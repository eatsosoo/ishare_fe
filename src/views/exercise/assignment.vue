<template>
  <PageWrapper
    :title="t('form.gradingSearch.titleExam')"
    :content="t('form.gradingSearch.contentExam')"
  >
    <div class="py-8 bg-white flex flex-col justify-center items-center">
      <BasicForm @register="register" />
      <div class="flex justify-center">
        <a-button @click="resetFields"> {{ t('common.resetText') }} </a-button>
        <a-button class="!ml-4" type="primary" :loading="loading" @click="handleSubmit">
          {{ t('common.saveText') }}
        </a-button>
      </div>
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { PageWrapper } from '@/components/Page';
  import { BasicForm, useForm } from '@/components/Form';

  import { useI18n } from '@/hooks/web/useI18n';
  import { assignTestFormSchemas } from '../classroom/data';
  import { useDesign } from '@/hooks/web/useDesign';
  import { AssignmentForm } from '@/api/teacher/teacherModel';
  import { assignmentApi } from '@/api/teacher/teacher';
  import { ref } from 'vue';
  import { useMessage } from '@/hooks/web/useMessage';

  const { t } = useI18n();
  const { prefixCls } = useDesign('register');
  const [register, { validate, resetFields }] = useForm({
    baseColProps: { span: 24 },
    labelWidth: 100,
    showActionButtonGroup: false,
    schemas: assignTestFormSchemas,
  });
  const { createSuccessModal, createErrorModal } = useMessage();

  const loading = ref(false);

  async function handleSubmit() {
    try {
      const { class_id, exam_id, title, date } = await validate();
      const submitForm: AssignmentForm = {
        class_id,
        exam_id,
        title,
        date: date.split(' ')[0],
      };
      loading.value = true;

      const result = await assignmentApi(submitForm);
      if (result) {
        createSuccessModal({
          title: t('form.gradingSearch.titleExam'),
          content: t('common.createSuccessfully'),
          getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
        });
        resetFields();
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
