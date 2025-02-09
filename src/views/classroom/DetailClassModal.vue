<template>
  <BasicModal
    v-bind="$attrs"
    title="Modal Title"
    width="1100px"
    :show-ok-btn="false"
    :show-cancel-btn="false"
    :can-fullscreen="false"
  >
    <Tabs v-model:activeTab="activeTab">
      <TabPane v-for="tab in tabs" :key="tab.key" v-bind="omit(tab, ['content', 'key'])">
        <BasicTable @register="tab.register" ref="tableRefs">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <Tag :color="record.status === 'v' ? 'green' : 'red'">
                {{ record.status }}
              </Tag>
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
  import { BasicTable, useTable } from '@/components/Table';
  import {
    getExamColumns,
    getExerciseColumns,
    getStudentColumns,
  } from '@/views/classroom/tableData';
  import { useI18n } from '@/hooks/web/useI18n';
  import { omit } from 'lodash-es';
  import { Tabs, Tag } from 'ant-design-vue';
  import { studentListApi } from '@/api/student/student';
  import { examListApi } from '@/api/exam/exam';
  import { getHomeworksOfClassApi } from '@/api/class/class';

  const props = defineProps({
    classId: {
      type: Number,
      required: true,
    },
  });
  const TabPane = Tabs.TabPane;
  const { t } = useI18n();
  const activeTab = ref('1');
  const tableRefs = ref([]);
  const [registerTable1, { reload: reload1 }] = useTable({
    canResize: true,
    api: studentListApi(),
    columns: getStudentColumns(),
    defSort: {
      field: 'name',
      order: 'ascend',
    },
    rowKey: 'id',
    showTableSetting: false,
    showIndexColumn: false,
  });

  const [registerTable2, { reload: reload2 }] = useTable({
    canResize: true,
    api: getHomeworksOfClassApi(),
    columns: getExerciseColumns(),
    defSort: {
      field: 'name',
      order: 'ascend',
    },
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
    rowKey: 'id',
    showTableSetting: false,
    showIndexColumn: false,
  });

  const tabs = [
    {
      key: '1',
      tab: t('table.studentList'),
      register: registerTable1,
    },
    {
      key: '2',
      tab: t('table.homeWorkList'),
      register: registerTable2,
    },
    {
      key: '3',
      tab: t('table.monthlyTestScore'),
      register: registerTable3,
    },
  ];

  watch(
    () => props.classId,
    () => {
      if (props.classId) {
        if (tableRefs.value[0]) {
          reload1();
        }
        if (tableRefs.value[1]) {
          reload2();
        }
        if (tableRefs.value[2]) {
          reload3();
        }
      }
    },
  );
</script>
