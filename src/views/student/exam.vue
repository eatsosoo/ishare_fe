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

    <div
      ref="domRef"
      v-show="isDomFullscreen"
      class="flex items-center justify-center w-1/2 h-64 mx-auto mt-10 bg-white rounded-md"
    >
      <a-button type="primary" @click="toggleDom" class="mr-2">
        {{ isDomFullscreen ? 'Exit Dom Full Screen' : 'Enter Dom Full Screen' }}
      </a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { useFullscreen } from '@vueuse/core';

  import { type Nullable } from '@vben/types';
  import BasicTable from '@/components/Table/src/BasicTable.vue';
  import { useTable } from '@/components/Table';
  import { useI18n } from '@/hooks/web/useI18n';
  import { getExamColumns, getSearchExamOfStudentConfig } from '@/views/classroom/tableData';
  import { examListApi } from '@/api/demo/table';
  import { Tag } from 'ant-design-vue';

  const domRef = ref<Nullable<HTMLElement>>(null);
  const { toggle: toggleDom, isFullscreen: isDomFullscreen } = useFullscreen(domRef);
  const { t } = useI18n();

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
</script>
