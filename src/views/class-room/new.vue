<template>
  <PageWrapper
    class="high-form"
    :title="t('form.newClassForm.title')"
    :content="t('form.newClassForm.description')"
  >
    <Card :title="t('form.newClassForm.information')" :bordered="false">
      <BasicForm @register="register" />
    </Card>
    <Card :title="t('form.newClassForm.student')" :bordered="false" class="!mt-5">
      <StudentTable ref="tableRef" />
    </Card>

    <template #rightFooter>
      <a-button type="primary" @click="submitAll"> 提交 </a-button>
    </template>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { BasicForm, useForm } from '@/components/Form';
  import { ref } from 'vue';
  import StudentTable from './StudentTable.vue';
  import { PageWrapper } from '@/components/Page';
  import { schemas } from './data';
  import { Card } from 'ant-design-vue';
  import { useI18n } from '@/hooks/web/useI18n';

  defineOptions({ name: 'FormHightPage' });

  const { t } = useI18n();
  const tableRef = ref<{ getDataSource: () => any } | null>(null);

  const [register, { validate }] = useForm({
    layout: 'vertical',
    baseColProps: {
      span: 6,
    },
    schemas: schemas,
    showActionButtonGroup: false,
  });

  async function submitAll() {
    try {
      if (tableRef.value) {
        console.log('table data:', tableRef.value.getDataSource());
      }

      const [values] = await Promise.all([validate()]);
      console.log('form data:', values);
    } catch (error) {
      console.log(error);
    }
  }
</script>
<style lang="less" scoped>
  .high-form {
    padding-bottom: 48px;
  }
</style>
