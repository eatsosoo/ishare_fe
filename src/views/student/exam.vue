<template>
  <div>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'score'">{{
          record.score ? `${record.score}/${record.total_questions}` : t('common.noScoreYet')
        }}</template>
        <template v-if="column.key === 'status'">
          <Tag :color="record.completed_at ? 'green' : 'red'">
            {{ record.completed_at ? 'v' : 'x' }}
          </Tag>
        </template>
        <template v-if="column.key === 'action' && !record.completed_at">
          <a-button
            size="small"
            preIcon="ant-design:edit-filled"
            @click="clickOpen(record.exam_id, record.skill)"
          />
        </template>
      </template>
    </BasicTable>

    <div ref="domRef" v-show="isDomFullscreen" class="bg-white">
      <div class="mb-4 flex items-center justify-end gap-2 m-4">
        <a-button type="default">Thời gian: {{ timeLeft }}</a-button>
        <a-button type="primary" @click="toggleDom"> Nộp bài </a-button>
      </div>
      <div class="px-4 h-full">
        <ExamineType1 :value="examPart" />
      </div>
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
  import {
    getExamOfStudentColumns,
    getSearchExamOfStudentConfig,
  } from '@/views/classroom/tableData';
  import { Tag } from 'ant-design-vue';
  import ExamineType1 from './ExamineType1.vue';
  import { getExamListOfStudentApi } from '@/api/student/student';
  import { examDetailApi } from '@/api/exam/exam';
  import { ExamPartItem } from '@/api/exam/examModel';

  const domRef = ref<Nullable<HTMLElement>>(null);
  const { toggle: toggleDom, isFullscreen: isDomFullscreen } = useFullscreen(domRef);
  const { t } = useI18n();

  const timeLeft = ref('');
  const examDuration = ref(40 * 60); // Example: 1 hour in seconds
  const loading = ref(false);
  const examPart = ref<ExamPartItem[]>([]);

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
    api: getExamListOfStudentApi(),
    columns: getExamOfStudentColumns(),
    useSearchForm: true,
    formConfig: getSearchExamOfStudentConfig(),
    showTableSetting: false,
    tableSetting: { fullScreen: true },
    showIndexColumn: true,
    rowKey: 'id',
    showSelectionBar: false,
    actionColumn: {
      title: t('table.action'),
      dataIndex: 'action',
    },
  });

  function clickOpen(examId: number, skill: string) {
    console.log(examId);
    // toggleDom();
    getExamDetail(examId, skill);
  }

  function preventF5(event) {
    if (event.key === 'F5' || event.key === 'Escape') {
      event.preventDefault();
    }
  }

  async function getExamDetail(examId: number, skill: string) {
    try {
      loading.value = true;
      const result = await examDetailApi(examId);
      examPart.value = result[skill];
    } catch (error) {
      console.log(error);
      // createMessage.error(t('sys.app.dataNotFound'));
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', preventF5);
  });

  onBeforeUnmount(() => {
    window.addEventListener('keydown', preventF5);
  });
</script>

<style lang="less" scoped>
  .box-shadow {
    box-shadow: 0 -12px 20px -22px rgb(0 0 0 / 45%);
  }

  .shadow2 {
    box-shadow:
      0 2px 4px 0 rgb(0 0 0 / 13%),
      0 1px 1px 0 rgb(0 0 0 / 11%);
  }
</style>
