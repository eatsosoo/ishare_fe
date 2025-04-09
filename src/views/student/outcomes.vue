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
  import { useUserStore } from '@/store/modules/user';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useGlobSetting } from '@/hooks/setting';
  import { classListUserApi } from '@/api/class/class';

  const { t } = useI18n();
  const resutlStudy: FormSchema[] = [
    {
      field: '[from, to]',
      label: t('common.time'),
      component: 'RangePicker',
      componentProps: {
        format: 'YYYY-MM-DD',
        placeholder: [t('common.startDate'), t('common.endDate')],
      },
      required: true,
      colProps: {
        span: 12,
        offset: 1,
      },
    },
    {
      field: 'class_id',
      component: 'ApiSelect',
      label: t('form.gradingSearch.className'),
      componentProps: {
        api: classListUserApi(),
        resultField: 'items',
        labelField: 'title',
        valueField: 'id',
        immediate: true,
      },
      required: true,
      colProps: {
        span: 12,
        offset: 1,
      },
    },
  ];

  const [register, { validate }] = useForm({
    labelWidth: 120,
    schemas: resutlStudy,
    actionColOptions: {
      span: 24,
    },
    submitFunc: handleSubmit,
  });

  async function handleSubmit() {
    try {
      const data = await validate();
      const from = data.from.split(' ')[0];
      const to = data.to.split(' ')[0];
      const classId = data.class_id;
      const useStore = useUserStore();
      const config = useGlobSetting();
      const baseUrl = config.apiUrl;

      const response = await fetch(
        `${baseUrl}/users/export-study-result/${useStore.userInfo?.id}/${from}/${to}/${classId}`,
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
      link.setAttribute('download', `study-result-${from}-${to}.xlsx`);
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
