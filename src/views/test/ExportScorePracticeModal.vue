<template>
  <BasicModal
    v-bind="$attrs"
    :title="t('component.excel.exportModalTitle')"
    @ok="handleOk"
    @register="registerModal"
  >
    <BasicTable @register="registerClassTable" :max-height="300">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <Icon
            icon="ant-design:select-outlined"
            :size="18"
            class="cursor-pointer hover:border-red border-1 border-gray-200 p-1 rounded-md mr-2"
            @click="exportExcel(record.id)"
          />
        </template>
      </template>
    </BasicTable>
  </BasicModal>
</template>

<script setup lang="ts">
  import { classListApi } from '@/api/class/class';
  import { BasicTable, useTable } from '@/components/Table';
  import { useI18n } from '@/hooks/web/useI18n';
  import { getClassColumns, getFormSearchClassConfig } from '../classroom/tableData';
  import { BasicModal } from '@/components/Modal';
  import Icon from '@/components/Icon/Icon.vue';

  const props = defineProps({
    practiceId: {
      type: Number,
      default: 0,
    },
  });

  const { t } = useI18n();

  const [registerClassTable] = useTable({
    title: t('routes.page.classroomList'),
    api: classListApi(),
    columns: getClassColumns(),
    useSearchForm: true,
    formConfig: getFormSearchClassConfig(),
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    showIndexColumn: true,
    rowKey: 'id',
    showSelectionBar: false,
    actionColumn: {
      title: t('table.action'),
      dataIndex: 'action',
    },
  });

  async function exportExcel(classId: number) {
    try {
      loading.value = true; // Start loading
      const config = useGlobSetting();
      const baseUrl = config.apiUrl;

      const response = await fetch(
        `${baseUrl}/exam/export-excel?class_id=${classId}&exam_id=${props.practiceId}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );

      if (!response.ok) throw new Error('Failed to fetch file');

      // 📌 Nhận dữ liệu dưới dạng Blob
      const blob = await response.blob();

      // 📌 Lấy tên file từ header `Content-Disposition`
      const disposition = response.headers.get('Content-Disposition');
      const fileName = disposition
        ? disposition.split('filename=')[1]
        : `study-result-${from}-${to}.xlsx`;

      // 📌 Hỗ trợ Safari & IE
      if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) {
        (window.navigator as any).msSaveOrOpenBlob(blob, fileName);
      } else {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);

        if (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) {
          window.open(url);
        } else {
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }

        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      loading.value = false; // Stop loading
    }
  }
</script>
