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

  const resutlStudy: FormSchema[] = [
    {
      field: '[from, to]',
      label: 'Time',
      component: 'RangePicker',
      componentProps: {
        format: 'YYYY-MM-DD',
        placeholder: ['Start date', 'End date'],
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
      const useStore = useUserStore();
      const response = await fetch(`https://api-gateway.danda.vn/api/users/export-study-result`, {
        method: 'POST',
        headers: {
          Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ user_id: useStore.getUserInfo.id, from, to }),
      });

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
