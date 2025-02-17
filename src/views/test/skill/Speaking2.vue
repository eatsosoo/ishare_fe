<template>
  <div class="bg-white px-2 mb-8">
    <Row :gutter="[16, 16]">
      <Col :span="24">
        <div class="p-4 mt-4 re-box-shadow rounded-lg">
          <h3>{{ t('common.writingSubject') }}</h3>
          <Tinymce v-model="speakingParts[0].subject" width="100%" />
        </div>
      </Col>
    </Row>
  </div>
</template>

<script lang="ts" setup>
  import { useI18n } from '@/hooks/web/useI18n';
  import { ref, watch } from 'vue';
  import { Tinymce } from '@/components/Tinymce';
  import { Row, Col } from 'ant-design-vue';
  import { ExamPartForm, ExamPartItem, SkillType } from '@/api/exam/examModel';
  import { SPEAKING_DEFAULT } from '@/views/test/data';
  import { examPartApi } from '@/api/exam/exam';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useDesign } from '@/hooks/web/useDesign';

  const props = defineProps({
    value: {
      type: Array as PropType<ExamPartItem[]>,
      default: SPEAKING_DEFAULT,
    },
    type: {
      type: String as PropType<SkillType>,
      default: 'writing',
    },
  });

  const { t } = useI18n();
  const loading = ref(false);
  const speakingParts = ref<ExamPartItem[]>(props.value);
  const { createErrorModal, createSuccessModal } = useMessage();
  const { prefixCls } = useDesign('register');

  async function submitAll(examId: number) {
    try {
      loading.value = true;
      const { subject, questions, id, duration } = speakingParts.value[0];
      const submitForm: ExamPartForm = {
        id: id || null,
        exam_id: examId,
        type: 'Speaking',
        subject,
        questions,
        duration,
        media: null,
        questions_count: questions.length,
      };
      const result = await examPartApi(submitForm);
      if (result) {
        createSuccessModal({
          title: t('form.exam.editSkill', { skill: 'Speaking' }),
          content: t('common.createSuccessfully'),
          getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
        });
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

  watch(
    () => props.value,
    (value) => {
      speakingParts.value = value.length === 0 ? SPEAKING_DEFAULT : value;
    },
  );

  defineExpose({
    submitAll,
  });
</script>

<style lang="less" scoped>
  .re-box-shadow {
    box-shadow:
      rgb(50 50 93 / 25%) 0 2px 5px -1px,
      rgb(0 0 0 / 30%) 0 1px 3px -1px;
  }
</style>
