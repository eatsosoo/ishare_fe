<template>
  <PageWrapper
    class="high-form"
    :title="t('form.newClassForm.title')"
    :content="t('form.newClassForm.description')"
  >
    <Card :title="t('form.newClassForm.information')" :bordered="false">
      <BasicForm @register="register" />
    </Card>
    <Card :title="titlePreviewTable" :bordered="false" class="!mt-5">
      <StudentTable ref="tableRef" @select-students="handleRegisterStudentToClass" />
    </Card>

    <template #rightFooter>
      <a-button type="primary" @click="submitAll"> {{ t('common.confirm') }} </a-button>
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
  import { StudentListItem } from '@/api/demo/model/tableModel';

  defineOptions({ name: 'FormHightPage' });

  const { t } = useI18n();
  const tableRef = ref<{ getDataSource: () => any } | null>(null);
  const studentsRegistered = ref<StudentListItem[]>([]);

  const [register, { validate }] = useForm({
    layout: 'vertical',
    baseColProps: {
      span: 6,
    },
    schemas: schemas,
    showActionButtonGroup: false,
  });

  const titlePreviewTable = `${t('form.newClassForm.studentRegister')} (${t('table.numberStudent')}: ${studentsRegistered.value.length})`;

  async function submitAll() {
    try {
      if (tableRef.value) {
        console.log('table data:', tableRef.value.getDataSource());
      }

      const [values] = await Promise.all([validate()]);
      console.log('form data:', { ...values, students: studentsRegistered.value });
    } catch (error) {
      console.log(error);
    }
  }

  function handleRegisterStudentToClass(data: StudentListItem[]) {
    studentsRegistered.value = data;
  }
</script>
<style lang="less" scoped>
  .high-form {
    padding-bottom: 48px;
  }
</style>
