<template>
  <BasicModal
    v-bind="$attrs"
    :title="props.title"
    width="500px"
    :height="300"
    :can-fullscreen="false"
    :loading="loading"
    @ok="exportExcelStudent"
  >
    <div class="mb-10">
      <p
        >{{ t('common.student') }}:
        <span class="text-xl font-500">{{ props.student.name }}</span></p
      >
      <p
        >{{ t('common.target') }}: <Tag color="green" class="ml-2">{{ props.student.target }}</Tag>
      </p>
      <p class="font-italic">{{ t('common.descExcelStudy') }}</p>
    </div>
    <BasicForm @register="register" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal } from '@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '@/components/Form';
  import { getToken } from '@/utils/auth';
  import { ref } from 'vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { Tag } from 'ant-design-vue';
  import { useGlobSetting } from '@/hooks/setting';

  const props = defineProps({
    student: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
  });

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
    },
  ];

  const loading = ref(false);

  const [register, { validate }] = useForm({
    labelWidth: 120,
    schemas: resutlStudy,
    actionColOptions: {
      span: 24,
    },
    showActionButtonGroup: false,
  });

  async function exportExcelStudent() {
    try {
      const data = await validate();
      const from = data.from.split(' ')[0];
      const to = data.to.split(' ')[0];
      const config = useGlobSetting();
      const baseUrl = config.apiUrl;

      const response = await fetch(
        `${baseUrl}/users/export-study-result/${props.student.id}/${from}/${to}`,
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
    }
  }
</script>
