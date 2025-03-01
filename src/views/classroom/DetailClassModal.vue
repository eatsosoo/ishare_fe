<template>
  <BasicModal
    v-bind="$attrs"
    title="Modal Title"
    width="1100px"
    :show-ok-btn="false"
    :show-cancel-btn="false"
    :can-fullscreen="false"
  >
    <Tabs v-model:activeTab="activeTab" @change="activeKey = $event">
      <TabPane v-for="tab in tabs" :key="tab.key" v-bind="omit(tab, ['content', 'key'])">
        <BasicTable @register="tab.register" ref="tableRefs" class="max-h-[770px]">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <div class="flex gap-2 justify-center">
                <Icon
                  :size="18"
                  icon="ant-design:export"
                  class="cursor-pointer hover:border-red border-1 border-gray-200 p-1 rounded-md"
                  @click="exportExcelStudent('2025-02-01', '2025-02-28', record.id)"
                />
              </div>
            </template>
          </template>
        </BasicTable>
      </TabPane>
    </Tabs>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { BasicModal } from '@/components/Modal';
  import { BasicTable, FormProps, useTable } from '@/components/Table';
  import {
    getExamColumns,
    getExerciseColumns,
    getStudentOfClassColumns,
  } from '@/views/classroom/tableData';
  import { useI18n } from '@/hooks/web/useI18n';
  import { omit } from 'lodash-es';
  import { Tabs } from 'ant-design-vue';
  import { examListApi } from '@/api/exam/exam';
  import { getHomeworksOfClassApi, getStudentsOfClassApi } from '@/api/class/class';
  import { Key } from 'ant-design-vue/es/_util/type';
  import { getToken } from '@/utils/auth';
  import Icon from '@/components/Icon/Icon.vue';

  const props = defineProps({
    classId: {
      type: Number,
      required: true,
    },
  });

  const TabPane = Tabs.TabPane;

  const { t } = useI18n();
  const activeTab = ref('1');
  const activeKey = ref<Key>('1');
  const tableRefs = ref([]);
  function searchConfig(): Partial<FormProps> {
    return {
      labelWidth: 100,
      schemas: [
        {
          field: 'student_name',
          component: 'Input',
          label: t('form.exerciseSearch.studentName'),
          colProps: {
            xl: 6,
            xxl: 6,
          },
        },
      ],
    };
  }

  const [registerTable1, { reload: reload1 }] = useTable({
    canResize: true,
    api: getStudentsOfClassApi(),
    columns: getStudentOfClassColumns(),
    defSort: {
      field: 'name',
      order: 'ascend',
    },
    useSearchForm: true,
    formConfig: searchConfig(),
    rowKey: 'id',
    showTableSetting: false,
    showIndexColumn: false,
    actionColumn: {
      title: t('table.action'),
      dataIndex: 'action',
    },
  });

  const [registerTable2, { reload: reload2 }] = useTable({
    canResize: true,
    api: getHomeworksOfClassApi(),
    columns: getExerciseColumns(),
    defSort: {
      field: 'name',
      order: 'ascend',
    },
    useSearchForm: true,
    formConfig: searchConfig(),
    rowKey: 'id',
    showTableSetting: false,
    showIndexColumn: false,
  });

  const [registerTable3, { reload: reload3 }] = useTable({
    canResize: true,
    api: examListApi(),
    columns: getExamColumns(),
    defSort: {
      field: 'name',
      order: 'ascend',
    },
    useSearchForm: true,
    formConfig: searchConfig(),
    rowKey: 'id',
    showTableSetting: false,
    showIndexColumn: false,
  });

  const tabs = [
    {
      key: 0,
      tab: t('table.studentList'),
      register: registerTable1,
    },
    // {
    //   key: 1,
    //   tab: t('table.homeWorkList'),
    //   register: registerTable2,
    // },
    // {
    //   key: 2,
    //   tab: t('table.monthlyTestScore'),
    //   register: registerTable3,
    // },
  ];

  const reloadFunctions = [reload1, reload2, reload3];

  const reloadTable = () => {
    if (tableRefs.value[0]) {
      reloadFunctions[0]();
    }
    // if (tableRefs.value[1]) {
    //   reloadFunctions[1]();
    // }
    // if (tableRefs.value[2]) {
    //   reloadFunctions[2]();
    // }
  };

  async function exportExcelStudent(from, to, user_id) {
    try {
      const response = await fetch(`https://api-gateway.danda.vn/api/users/export-study-result`, {
        method: 'POST',
        headers: {
          Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ user_id, from, to }),
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

  watch(
    () => props.classId,
    () => {
      if (!props.classId) return;
      reloadTable();
    },
  );
</script>
