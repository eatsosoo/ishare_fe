<template>
  <div>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <Tag :color="record.status === 'v' ? 'green' : 'red'">
            {{ record.status }}
          </Tag>
        </template>
        <template v-if="column.key === 'action' && record.status === 'x'">
          <a-button size="small" preIcon="ant-design:edit-filled" @click="clickOpen(record.id)" />
        </template>
      </template>
    </BasicTable>

    <div ref="domRef" v-show="isDomFullscreen" class="bg-white p-4">
      <div class="mb-4 flex items-center justify-end gap-2">
        <a-button type="default">Thời gian: {{ timeLeft }}</a-button>
        <a-button type="primary" @click="toggleDom"> Nộp bài </a-button>
      </div>
      <ExamineType1 />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { onBeforeUnmount, onMounted, ref } from 'vue';
  import { useFullscreen } from '@vueuse/core';

  import { type Nullable } from '@vben/types';
  import BasicTable from '@/components/Table/src/BasicTable.vue';
  import { useTable } from '@/components/Table';
  import { useI18n } from '@/hooks/web/useI18n';
  import { getExamColumns, getSearchExamOfStudentConfig } from '@/views/classroom/tableData';
  import { examListApi } from '@/api/demo/table';
  import { Tag } from 'ant-design-vue';
  import ExamineType1 from './ExamineType1.vue';

  const domRef = ref<Nullable<HTMLElement>>(null);
  const { toggle: toggleDom, isFullscreen: isDomFullscreen } = useFullscreen(domRef);
  const { t } = useI18n();
  const timeLeft = ref('');
  const examDuration = ref(40 * 60); // Example: 1 hour in seconds
  const interval = setInterval(() => {
    const minutes = Math.floor(examDuration.value / 60);
    const seconds = examDuration.value % 60;
    timeLeft.value = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    if (examDuration.value <= 0) {
      clearInterval(interval);
      // Handle exam end logic here
    }
    examDuration.value--;
  }, 1000);

  const [registerTable] = useTable({
    api: examListApi(),
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

  function clickOpen(examId: string) {
    console.log(examId);
    toggleDom();
  }

  function preventF5(event) {
    if (event.key === 'F5') {
      event.preventDefault();
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', preventF5);
  });

  onBeforeUnmount(() => {
    window.addEventListener('keydown', preventF5);
  });
</script>
