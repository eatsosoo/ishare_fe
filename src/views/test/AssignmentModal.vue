<template>
  <BasicModal
    v-bind="$attrs"
    :title="t('form.exam.title')"
    :default-fullscreen="true"
    :loading="loading"
    @ok="handleSubmit"
    @cancel="resetFields"
  >
    <div class="shadow-lg rounded-lg p-1 mx-1 mb-4">
      <CollapseContainer :title="t('common.basicInformation')">
        <BasicForm @register="registerForm" ref="formRef" />
      </CollapseContainer>
    </div>
    <div class="shadow-lg rounded-lg p-1 mx-1">
      <SelectClass :extend="false" @select="classId = $event" ref="selectClassRef" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal } from '@/components/Modal';
  import { BasicForm, useForm } from '@/components/Form';
  import { assignTestFormSchemas } from '@/views/classroom/data';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useDesign } from '@/hooks/web/useDesign';
  import { AssignmentForm } from '@/api/teacher/teacherModel';
  import { assignmentApi } from '@/api/teacher/teacher';
  import { CollapseContainer } from '@/components/Container';
  import SelectClass from '../exercise/SelectClass.vue';

  const { t } = useI18n();
  const { createErrorModal, createSuccessModal } = useMessage();
  const [registerForm, { validate, resetFields }] = useForm({
    labelWidth: 120,
    schemas: assignTestFormSchemas,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });
  const { prefixCls } = useDesign('register');

  const loading = ref(false);
  const formRef = ref<InstanceType<typeof BasicForm> | undefined>();
  const classId = ref<number | null>(null);
  const selectClassRef = ref();

  const emit = defineEmits(['success']);

  async function handleSubmit() {
    try {
      const { exam_id, title, date } = await validate();
      if (!classId.value) {
        createErrorModal({
          title: t('form.selectClass'),
          content: t('form.notSelect'),
        });
        return;
      }

      const submitForm: AssignmentForm = {
        class_id: classId.value,
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
