<template>
  <div>
    <!-- <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <Tag :color="record.status === 'v' ? 'green' : 'red'">
            {{ record.status }}
          </Tag>
        </template>
      </template>
    </BasicTable> -->
    <Card>
      <BasicForm @register="register" />
    </Card>
  </div>
</template>
<script lang="ts" setup>
  import BasicTable from '@/components/Table/src/BasicTable.vue';
  import { FormSchema, useTable } from '@/components/Table';
  import { useI18n } from '@/hooks/web/useI18n';
  import { getExamColumns, getSearchExamOfStudentConfig } from '@/views/classroom/tableData';
  import { Tag, Card } from 'ant-design-vue';
  import { getExamCapacityApi } from '@/api/student/student';
  import { useForm, BasicForm } from '@/components/Form';
  import { getToken } from '@/utils/auth';
  import { getUserInfo } from '@/api/sys/user';
  import { useUserStore } from '@/store/modules/user';

  const { t } = useI18n();

  const [registerTable] = useTable({
    api: getExamCapacityApi(),
    columns: getExamColumns(),
    useSearchForm: true,
    formConfig: getSearchExamOfStudentConfig(),
    showTableSetting: false,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    rowKey: 'id',
    showSelectionBar: false,
    actionColumn: {
      title: t('table.action'),
      dataIndex: 'action',
    },
  });

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
