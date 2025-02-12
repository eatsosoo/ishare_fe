<template>
  <PageWrapper
    :title="t('form.gradingSearch.titleExam')"
    :content="t('form.gradingSearch.contentExam')"
  >
    <div class="py-8 bg-white flex flex-col justify-center items-center">
      <BasicForm @register="register" />
      <div class="flex justify-center">
        <a-button @click="resetFields"> {{ t('common.resetText') }} </a-button>
        <a-button class="!ml-4" type="primary" @click="handleSubmit">
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
  import { assignFormSchemas } from '../classroom/data';

  const { t } = useI18n();
  const [register, { validate, resetFields }] = useForm({
    baseColProps: { span: 24 },
    labelWidth: 100,
    showActionButtonGroup: false,
    schemas: assignFormSchemas,
  });

  async function handleSubmit() {
    try {
      const values = await validate();
      const { class_id, exam_id } = values;

      // TODO custom api
      console.log(class_id, exam_id);
      // const { router } = useRouter();
      // router.push(pageEnum.BASE_LOGIN);
    } catch (error) {
      console.error(error);
    }
  }
</script>
