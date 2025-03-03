<template>
  <PageWrapper
    class="high-form"
    :title="t('form.newClassForm.title')"
    :content="t('form.newClassForm.description')"
  >
    <Card :title="t('form.newClassForm.information')" :bordered="false">
      <BasicForm @register="register" />
    </Card>
    <Card :title="t('form.shift')" class="mt-5">
      <ShiftTable @change="shiftData = $event" />
    </Card>
    <Card :title="titlePreviewTable" :bordered="false" class="!mt-5">
      <StudentTable ref="tableRef" @select-students="handleRegisterStudentToClass" />
    </Card>

    <template #rightFooter>
      <a-button type="primary" @click="submitAll" :loading="loading">
        {{ t('common.confirm') }}
      </a-button>
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
  import { useMessage } from '@/hooks/web/useMessage';
  import { useDesign } from '@/hooks/web/useDesign';
  import { createClassApi } from '@/api/class/class';
  import { CreateClassParams } from '@/api/class/classModel';
  import { StudentListItem } from '@/api/student/studentModel';
  import ShiftTable from './ShiftTable.vue';

  defineOptions({ name: 'FormHightPage' });

  const { t } = useI18n();
  const tableRef = ref<{ getDataSource: () => any } | null>(null);
  const studentsRegistered = ref<StudentListItem[]>([]);
  const shiftData = ref<any[]>([]);
  const loading = ref(false);

  const { prefixCls } = useDesign('register');
  const { createErrorModal, createSuccessModal } = useMessage();
  const [register, { validate, resetFields }] = useForm({
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
      loading.value = true;
      const [values] = await Promise.all([validate()]);
      const { title, description, start_date, key } = values;
      const submitForm: CreateClassParams = {
        title,
        description,
        start_date,
        key,
        shifts: shiftData.value,
        students: studentsRegistered.value.map((student) => ({ id: student.id })),
      };

      const newClass = await createClassApi(submitForm);
      if (newClass) {
        createSuccessModal({
          title: t('form.newClassForm.title'),
          content: t('common.createSuccessfully'),
          getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
        });
        resetFields();
      }
    } catch (error) {
      const apiMessage = error.response.data.message;
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

  function handleRegisterStudentToClass(data: StudentListItem[]) {
    studentsRegistered.value = data;
  }
</script>
<style lang="less" scoped>
  .high-form {
    padding-bottom: 48px;
  }
</style>
