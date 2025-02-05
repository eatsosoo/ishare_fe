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

    <div ref="domRef" v-show="isDomFullscreen" class="bg-white">
      <div class="mb-4 flex items-center justify-end gap-2 m-4">
        <a-button type="default">Thời gian: {{ timeLeft }}</a-button>
        <a-button type="primary" @click="toggleDom"> Nộp bài </a-button>
      </div>
      <div class="px-4 h-full">
        <ExamineType1 />
      </div>

      <div class="sticky bottom-0 bg-white box-shadow">
        <div class="flex gap-4 py-2 px-2">
          <Card
            v-for="p in 3"
            :key="p"
            @click="tabActive = p"
            :class="tabActive === p ? 'shrink-0 border-[#0960bd]' : 'flex-1 cursor-pointer'"
          >
            <div v-if="tabActive === p" class="flex items-center">
              <div class="text-xl font-semibold mr-2">Part {{ p }}</div>
              <div class="flex gap-2">
                <div
                  v-for="q in 13"
                  :key="q"
                  class="rounded-full h-8 w-8 border flex items-center justify-center border-gray-200"
                >
                  {{ q }}
                </div>
              </div>
            </div>
            <div v-else class="text-lg text-center">
              <span class="font-semibold mr-4">Part {{ p }}</span>
              <span class="font-light">0 of 13 questions</span>
            </div>
          </Card>
        </div>
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
  import { getExamColumns, getSearchExamOfStudentConfig } from '@/views/classroom/tableData';
  import { examListApi } from '@/api/demo/table';
  import { Card, Tag } from 'ant-design-vue';
  import ExamineType1 from './ExamineType1.vue';

  const domRef = ref<Nullable<HTMLElement>>(null);
  const { toggle: toggleDom, isFullscreen: isDomFullscreen } = useFullscreen(domRef);
  const { t } = useI18n();
  const tabActive = ref(1);
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
