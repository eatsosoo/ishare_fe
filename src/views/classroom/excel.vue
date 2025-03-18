<template>
  <div>
    <Card>
      <BasicForm @register="register" />
    </Card>
  </div>
</template>
<script lang="ts" setup>
  import { FormSchema } from '@/components/Table';
  import { Card } from 'ant-design-vue';
  import { useForm, BasicForm } from '@/components/Form';
  import { getToken } from '@/utils/auth';
  import { useI18n } from '@/hooks/web/useI18n';
  import { classListApi } from '@/api/class/class';
  import { useGlobSetting } from '@/hooks/setting';

  const { t } = useI18n();
  const config = useGlobSetting();
  const academicResults: FormSchema[] = [
    {
      field: 'classId',
      component: 'ApiSelect',
      label: t('form.gradingSearch.className'),
      componentProps: {
        api: classListApi(),
        params: {
          id: 1,
        },
        resultField: 'items',
        labelField: 'title',
        valueField: 'id',
        immediate: true,
      },
      required: true,
      colProps: {
        offset: 1,
        xl: 12,
        xxl: 12,
      },
    },
    {
      field: 'exeType',
      label: t('form.exeType'),
      component: 'Select',
      componentProps: {
        options: [
          {
            label: t('common.assignAtClass'),
            value: 'class',
          },
          {
            label: t('common.assignAtHome'),
            value: 'home',
          },
        ],
      },
      required: true,
      colProps: {
        offset: 1,
        xl: 12,
        xxl: 12,
      },
    },
    {
      field: 'date',
      label: t('common.time'),
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM',
        picker: 'month',
      },
      required: true,
      colProps: {
        offset: 1,
        xl: 12,
        xxl: 12,
      },
    },
  ];

  const [register, { validate }] = useForm({
    labelWidth: 120,
    schemas: academicResults,
    actionColOptions: {
      span: 24,
    },
    submitFunc: handleSubmit,
  });

  async function handleSubmit() {
    try {
      const data = await validate();
      const { date, classId, exeType } = data;
      const formatDate = date.split(' ')[0].slice(0, 7);
      const baseUrl = config.apiUrl;
      const response = await fetch(
        `${baseUrl}/homeworks/export?class_id=${classId}&date=${formatDate}&type=${exeType}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );

      if (!response.ok) throw new Error('Failed to fetch file');

      // Nhận dữ liệu dưới dạng Blob
      const blob = await response.blob();

      // 🛠️ Tạo link để tải file
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `exercise-${date}.xlsx`);
      document.body.appendChild(link);
      link.click();

      // 🧹 Xóa link sau khi tải xong
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  }
</script>
