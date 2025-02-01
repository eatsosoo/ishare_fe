<template>
  <BasicModal v-bind="$attrs" title="Modal Title" width="1100px" @fullscreen="onFullscreen">
    <Tabs v-model:activeKey="activeKey">
      <TabPane v-for="tab in tabs" :key="tab.key" v-bind="omit(tab, ['content', 'key'])">
        <BasicTable @register="tab.register" ref="selectTable">
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
    <template #footer></template>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, nextTick } from 'vue';
  import { BasicModal } from '@/components/Modal';
  import { BasicTable, useTable } from '@/components/Table';
  import {
    getExamColumns,
    getExerciseColumns,
    getStudentColumns,
  } from '@/views/classroom/tableData';
  import { examListApi, exerciseListApi, studentListApi } from '@/api/demo/table';
  import { useI18n } from '@/hooks/web/useI18n';
  import { omit } from 'lodash-es';
  import { Tabs, Tag } from 'ant-design-vue';

  const TabPane = Tabs.TabPane;
  const { t } = useI18n();
  const activeKey = ref('1');
  const [registerTable1] = useTable({
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

  const [registerTable2] = useTable({
    canResize: true,
    api: exerciseListApi(),
    columns: getExerciseColumns(),
    defSort: {
      field: 'name',
      order: 'ascend',
    },
    rowKey: 'id',
    showTableSetting: false,
    showIndexColumn: false,
  });

  const [registerTable3] = useTable({
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

  const selectTable = ref<InstanceType<typeof BasicTable> | undefined>();

  const onFullscreen = async () => {
    await nextTick();
    selectTable.value?.redoHeight();
  };
</script>
